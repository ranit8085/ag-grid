import React, { Component } from "react";
import { render } from "react-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";


export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        {
          field: "name",
          cellRenderer: "agGroupCellRenderer"
        },
        { field: "account" },
        { field: "calls" },
        {
          field: "minutes",
          valueFormatter: "x.toLocaleString() + 'm'"
        }
      ],
      detailCellRendererParams: {
        detailGridOptions: {
          columnDefs: [
            { field: "callId" },
            { field: "direction" },
            { field: "number" },
            {
              field: "duration",
              valueFormatter: "x.toLocaleString() + 's'"
            },
            { field: "switchCode" }
          ],
          onGridReady: function(params) {
            params.api.sizeColumnsToFit();
          }
        },
        getDetailRowData: function(params) {
          params.successCallback(params.data.callRecords);
        }
      },
      onGridReady: function(params) {
        params.api.sizeColumnsToFit();
        setTimeout(function() {
          var rowCount = 0;
          params.api.forEachNode(function(node) {
            node.setExpanded(rowCount++ === 1);
          });
        }, 500);
      },
      rowData: []
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    const httpRequest = new XMLHttpRequest();
    const updateData = data => {
      this.setState({ rowData: data });
    };

    httpRequest.open(
      "GET",
      "https://raw.githubusercontent.com/ag-grid/ag-grid-docs/latest/src/javascript-grid-master-detail/simple/data/data.json"
    );
    httpRequest.send();
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        updateData(JSON.parse(httpRequest.responseText));
      }
    };

    params.api.sizeColumnsToFit();
    setTimeout(function() {
      var rowCount = 0;
      params.api.forEachNode(function(node) {
        node.setExpanded(rowCount++ === 1);
      });
    }, 500);
  }


  render() {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div id="myGrid" style={{boxSizing: "border-box", height: "100%", width: "100%" }} className="ag-theme-balham">
          <AgGridReact
            columnDefs={this.state.columnDefs}
            masterDetail={true}
            detailCellRendererParams={this.state.detailCellRendererParams}
            onGridReady={this.state.onGridReady}
            onGridReady={this.onGridReady.bind(this)}
            rowData={this.state.rowData} />
        </div>
      </div>
    );
  }
}

//export default App;
