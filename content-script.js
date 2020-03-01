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

function getDataFromTableRow(row) {
  const arr = [];

  const length = row.length;
  // First column is Row data and Last column is empty data, so ignore those data.
  for (let col = 1; col < length - 1; col++) {
    const column = row[col];
    arr.push(column.textContent.trim());
  }
  return arr;
}

function getQueryResultsFromTable() {
  const bqResultTable = document.getElementsByTagName("bq-results-table")[0];
  const table = bqResultTable.getElementsByTagName("table")[0];

  const thead = table.getElementsByTagName("thead")[0];
  const headers = getDataFromTableRow(thead.getElementsByTagName("th"));

  const tbody = table.getElementsByTagName("tbody")[0];
  const bodyRows = tbody.getElementsByTagName("tr");

  const body = [];
  for (let row = 0; row < bodyRows.length; row++) {
    body.push(getDataFromTableRow(bodyRows[row].getElementsByTagName("td")));
  }

  return {
    headers,
    body,
  };
}

function convertDataToMarkdownTableText(tableData) {
  console.log(tableData);
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
