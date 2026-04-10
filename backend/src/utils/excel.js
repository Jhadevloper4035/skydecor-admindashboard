const XLSX = require("xlsx");

const MAX_DOWNLOAD_LIMIT = 10000;

/**
 * Converts the productType array to a comma-separated string
 * so it renders cleanly in a single Excel cell.
 */
function formatProductType(lead) {
  return {
    ...lead,
    ProductEnquire:
      Array.isArray(lead.ProductEnquire) && lead.ProductEnquire.length > 0
        ? lead.ProductEnquire.join(", ")
        : lead.ProductEnquire || "",
  };
}

/**
 * Fetches a paginated result set from the external website API.
 */
async function fetchFromExternalAPI(apiPath, page, limit) {
  const queryParams = new URLSearchParams({ page, limit });
  const response = await fetch(
    `${process.env.API_ENDPOINT}${apiPath}?${queryParams}`,
    {
      method: "GET",
      headers: {
        "x-admin-secret": process.env.ADMIN_SECRET,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`External API request failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * Serialises an array of plain objects to an xlsx buffer and
 * sends it as a file-download response.
 */
function sendExcelDownload(res, data, filename = "Leads.xlsx") {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Leads");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.send(buf);
}

/**
 * Parses page/limit from req.query with safe bounds.
 */
function parsePagination(query) {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(Math.max(1, parseInt(query.limit) || 10), MAX_DOWNLOAD_LIMIT);
  return { page, limit };
}

module.exports = {
  MAX_DOWNLOAD_LIMIT,
  formatProductType,
  fetchFromExternalAPI,
  sendExcelDownload,
  parsePagination,
};
