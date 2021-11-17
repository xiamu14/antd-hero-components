import { Table } from "antd";
import React from "react";

const ProTable = React.memo(() => {
  return (
    <div>
      <div>search bar</div>
      <div>header bar</div>
      <div>
        <Table dataSource={[]} columns={[]} />
      </div>
    </div>
  );
});

export default ProTable;
