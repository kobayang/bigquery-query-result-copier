function copyTextToClipboard(text) {
  //Create a textbox field where we can insert text to.
  const copyFrom = document.createElement("textarea");

  //Set the text content to be the text you wished to copy.
  copyFrom.textContent = text;

  //Append the textbox field into the body as a child.
  //"execCommand()" only works when there exists selected text, and the text is inside
  //document.body (meaning the text is part of a valid rendered HTML element).
  document.body.appendChild(copyFrom);

  //Select all the text!
  copyFrom.select();

  //Execute command
  document.execCommand("copy");

  //(Optional) De-select the text using blur().
  copyFrom.blur();

  //Remove the textbox field from the document.body, so no other JavaScript nor
  //other elements can get access to this.
  document.body.removeChild(copyFrom);
}

function getQueryResultsFromTable() {
  // TODO: Implement to get query results.
  return {
    headers: ["notification_count", "read_count", "click_count"],
    body: [[102083, 23883, 2303]],
  };
}

function convertDataToMarkdownTableText(tableData) {
  const convertLine = function(lineData) {
    return lineData.join(" | ");
  };
  const createEmptyLine = function(columnSize) {
    return Array.from({ length: columnSize }, (_, i) => "--").join(" | ");
  };
  return [
    convertLine(tableData.headers),
    createEmptyLine(tableData.headers.length),
    ...tableData.body.map(convertLine),
  ].join("\n");
}

// Observe event from popup.js
chrome.runtime.onMessage.addListener(message => {
  if (message.type !== "CLICK_COPY") {
    return;
  }
  const tableData = getQueryResultsFromTable();
  const tableText = convertDataToMarkdownTableText(tableData);
  copyTextToClipboard(tableText);
});
