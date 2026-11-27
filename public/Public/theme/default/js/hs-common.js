(function () {
  'use strict';

  function initHomesunCommon() {
    // 1. 右下角悬浮询盘开关（桌面端按钮 + 手机端底部 Get Quote 按钮共用）
    var panel = document.getElementById('hsInquiryPanel');
    var fabBtn = document.getElementById('hsInquiryToggle');
    var mobBtn = document.getElementById('hsMobileQuoteBtn');
    var closeBtn = document.getElementById('hsInquiryClose');

    function setInquiryOpen(open) {
      if (!panel) return;
      panel.hidden = !open;
      if (fabBtn) {
        fabBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
    }

    if (fabBtn) {
      fabBtn.addEventListener('click', function () {
        setInquiryOpen(panel ? panel.hidden : true);
      });
    }
    if (mobBtn) {
      mobBtn.addEventListener('click', function () {
        setInquiryOpen(panel ? panel.hidden : true);
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        setInquiryOpen(false);
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel && !panel.hidden) {
        setInquiryOpen(false);
      }
    });

    // 2. 产品详情页相册初始化（兼容单图无缩略图场景）
    var galleryEl = document.querySelector('#pro_img_gallery');
    if (galleryEl && typeof Swiper !== 'undefined') {
      var swiperOptions = {
        autoHeight: true,
        effect: 'fade',
      };
      var thumbsEl = document.querySelector('#pro_img_thumbs');
      if (thumbsEl) {
        swiperOptions.thumbs = {
          swiper: {
            el: '#pro_img_thumbs',
            spaceBetween: 5,
            slidesPerView: 6,
            watchSlidesVisibility: true,
          },
          autoScrollOffset: 1,
        };
      }
      new Swiper('#pro_img_gallery', swiperOptions);
    }

    // 3. 轻量弹窗提示（替代 layer.alert）
    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function showModal(title, message, isHtml) {
      var old = document.getElementById('hs-inquiry-modal');
      if (old) old.remove();

      var backdrop = document.createElement('div');
      backdrop.id = 'hs-inquiry-modal';
      backdrop.className = 'hs-modal-backdrop';

      var box = document.createElement('div');
      box.className = 'hs-modal-box';

      var titleEl = document.createElement('div');
      titleEl.className = 'hs-modal-title';
      titleEl.textContent = title;

      var msgEl = document.createElement('div');
      msgEl.className = 'hs-modal-msg';
      if (isHtml) {
        msgEl.innerHTML = message;
      } else {
        msgEl.textContent = message;
      }

      var okBtn = document.createElement('button');
      okBtn.type = 'button';
      okBtn.className = 'hs-modal-btn';
      okBtn.textContent = 'OK';

      box.appendChild(titleEl);
      box.appendChild(msgEl);
      box.appendChild(okBtn);
      backdrop.appendChild(box);

      backdrop.addEventListener('click', function (e) {
        if (e.target === backdrop || e.target === okBtn) {
          backdrop.remove();
        }
      });

      document.body.appendChild(backdrop);
    }

    // 4. 表单校验与 Web3Forms 异步提交
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validateForm(formEl) {
      var fields = formEl.querySelectorAll('[lay-verify]');
      for (var i = 0; i < fields.length; i++) {
        var el = fields[i];
        var rules = (el.getAttribute('lay-verify') || '').split('|');
        var val = (el.value || '').trim();
        var reqMsg = el.getAttribute('lay-reqText') || 'Please complete all required fields.';

        if (rules.indexOf('required') !== -1 && !val) {
          showModal('Notice', reqMsg, false);
          el.focus();
          return false;
        }
        if (rules.indexOf('email') !== -1 && val && !emailRegex.test(val)) {
          showModal('Notice', reqMsg, false);
          el.focus();
          return false;
        }
      }
      return true;
    }

    function handleWeb3Form(formEl, filterType, triggerBtn) {
      if (!validateForm(formEl)) return;

      var formData = new FormData(formEl);
      var payload = {
        source_page: window.location.href,
        botcheck: false,
      };
      formData.forEach(function (v, k) {
        payload[k] = v;
      });

      var origHtml = triggerBtn ? triggerBtn.innerHTML : '';
      if (triggerBtn) {
        triggerBtn.disabled = true;
        if (filterType !== 'send') {
          triggerBtn.textContent = 'Sending...';
        }
      }

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          return res.json().then(function (json) {
            return { ok: res.ok, json: json };
          });
        })
        .then(function (result) {
          if (result.ok && result.json && result.json.success) {
            formEl.reset();
            if (formEl.id === 'floatingForm') {
              setInquiryOpen(false);
            }
            var successMsg =
              filterType === 'send'
                ? 'Thank you for subscribing to Homesun updates!'
                : 'Your inquiry has been submitted successfully.<br>Our sales engineer will contact you within 12 hours.';
            showModal('Success', successMsg, true);
          } else {
            var errMsg =
              result.json && result.json.message
                ? escapeHtml(result.json.message)
                : 'Submission failed! Please email info@hssolar.com directly.';
            showModal('Error', errMsg, true);
          }
        })
        .catch(function () {
          showModal('Error', 'Network error! Please email info@hssolar.com directly.', false);
        })
        .finally(function () {
          if (triggerBtn) {
            triggerBtn.disabled = false;
            if (filterType !== 'send') {
              triggerBtn.innerHTML = origHtml;
            }
          }
        });
    }

    // 5. 绑定页脚订阅、悬浮询盘、产品详情页及联系页表单
    document.querySelectorAll('form.layui-form').forEach(function (formEl) {
      var btn = formEl.querySelector('[lay-submit]');
      if (!btn) return;
      var filterType = btn.getAttribute('lay-filter') || 'contact';

      formEl.addEventListener('submit', function (e) {
        e.preventDefault();
        handleWeb3Form(formEl, filterType, btn);
      });

      if (btn.getAttribute('type') === 'button') {
        btn.addEventListener('click', function () {
          handleWeb3Form(formEl, filterType, btn);
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomesunCommon);
  } else {
    initHomesunCommon();
  }
})();