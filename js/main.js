document.addEventListener('DOMContentLoaded', function() {
  var apertureInput = document.getElementById('aperture');
  var shutterInput = document.getElementById('shutter');
  var isoInput = document.getElementById('iso');

  var apertureVal = document.getElementById('aperture-val');
  var shutterVal = document.getElementById('shutter-val');
  var isoVal = document.getElementById('iso-val');

  var simImage = document.getElementById('sim-image');
  var noiseOverlay = document.getElementById('noise-overlay');
  var exposureStatus = document.getElementById('exposure-status');
  var exposureIndicator = document.getElementById('exposure-indicator');

  if (apertureInput && shutterInput && isoInput && simImage) {
    var shutterSpeeds = ['1/1000s', '1/500s', '1/250s', '1/125s', '1/60s', '1/30s', '1/15s'];

    function updateSimulator() {
      var aperture = parseFloat(apertureInput.value);
      var shutterIdx = parseInt(shutterInput.value) - 1;
      var iso = parseInt(isoInput.value);

      apertureVal.textContent = 'f/' + aperture;
      shutterVal.textContent = shutterSpeeds[shutterIdx] || '1/125s';
      isoVal.textContent = iso;

      var apertureFactor = (16 - aperture) / 14.6;
      var shutterFactor = (shutterIdx + 1) / 7;
      var isoFactor = (iso - 100) / 6300;
	  
      var totalExposure = (apertureFactor * 0.4) + (shutterFactor * 0.4) + (isoFactor * 0.2);
      var brightnessPercent = Math.min(250, Math.max(20, totalExposure * 200));
      
      var blurAmount = aperture < 6 ? (6 - aperture) * 1.8 : 0;

      simImage.style.filter = 'brightness(' + brightnessPercent + '%) blur(' + blurAmount + 'px)';

      var noiseOpacity = Math.min(0.7, (iso - 100) / 6400);
      if (noiseOverlay) {
        noiseOverlay.style.opacity = noiseOpacity;
      }

      if (brightnessPercent < 65) {
        exposureStatus.textContent = 'Недоекспонирана (Прекалено тъмна)';
      } else if (brightnessPercent > 145) {
        exposureStatus.textContent = 'Преекспонирана (Прекалено светла)';
      } else {
        exposureStatus.textContent = 'Балансирана експозиция';
      }

      var indicatorPos = Math.min(85, Math.max(5, (brightnessPercent / 220) * 85));
      if (exposureIndicator) {
        exposureIndicator.style.left = indicatorPos + '%';
      }
    }

    apertureInput.addEventListener('input', updateSimulator);
    shutterInput.addEventListener('input', updateSimulator);
    isoInput.addEventListener('input', updateSimulator);

    updateSimulator();
  }
});