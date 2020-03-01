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

function copy(callback = null) {
  try {
    const tableData = getQueryResultsFromTable();
    const text = convertDataToMarkdownTableText(tableData);
    copyTextToClipboard(text);
    typeof callback === "function" && callback({ type: "COPIED", text });
  } catch (error) {
    typeof callback === "function" && callback({ type: "ERROR", error });
  }
}

// Observe event from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type !== "CLICK_COPY") {
    return;
  }
  copy(sendResponse);
});

const copyText = document.createTextNode("Copy");
const copyButton = document.createElement("button");

copyButton.style.cssText = `
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: white;
  border-radius: 24px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.02), 0 0 0 1px rgba(0, 0, 0, 0.1);
  height: 36px;
  line-height: 36px;
  padding: 0 12px;
  font-size: 14px;
  text-align: center;
  color: rgba(0, 0, 0, 0.56);
  outline: none;
  min-width: 60px;
  border-style: none;
`;

copyButton.addEventListener("click", () => {
  copy(response => {
    console.log(response);

    if (response.type === "COPIED") {
      copyButton.textContent = "Copied!";
      setTimeout(() => {
        copyButton.textContent = "Copy";
      }, 2000);
    }
  });
});

console.log(copyButton);

copyButton.appendChild(copyText);
document.body.appendChild(copyButton);
