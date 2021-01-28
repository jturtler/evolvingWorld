// --------------------------

function Util() {}

Util.getRandNumBtw = function (start, end) {
  var range = end - start;

  var randRange = Math.floor(Math.random() * range);

  return start + randRange;
};

Util.getRandFromList = function (list) {
  var randIndex = Util.getRandNumBtw(0, list.length - 1);

  return list[randIndex];
};

Util.outputMsgAdd = function (msg, durationSec) {
  var divMsgTag = $('#divMsg');

  var quickMsgTag = $('<div class="quickMsg"></div>');
  quickMsgTag.text(msg);

  divMsgTag.append(quickMsgTag);

  if (durationSec) {
    setTimeout(function () {
      quickMsgTag.remove();
    }, durationSec * 1000);
  }
};
