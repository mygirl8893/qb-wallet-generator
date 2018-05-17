function copyToClipboard(id) {
  var copyText = document.getElementById(id);
  copyText.select();
  document.execCommand("Copy");
  alert("Copied the text: " + copyText.value);
}
