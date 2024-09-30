generateOverviewContent(); // 預設總覽頁面為首頁

// 點擊"總覽"時生成內容的函數
function generateOverviewContent() {
  const mainContent = document.querySelector(".main-content");
  mainContent.innerHTML = ""; // 清空之前的內容

  // 初始化時間範圍
  let timeRange = "week";

  // 請求訂單和營業額總數的函數
  function fetchOverviewData(timeRange) {
    const today = new Date();
    let startDate, endDate;

    // 根據時間範圍設定起始日期
    switch (timeRange) {
      case "week":
        startDate = new Date(today.setDate(today.getDate() - 7)).toISOString();
        break;
      case "month":
        startDate = new Date(
          today.setMonth(today.getMonth() - 1)
        ).toISOString();
        break;
      case "year":
        startDate = new Date(
          today.setFullYear(today.getFullYear() - 1)
        ).toISOString();
        break;
    }
    endDate = new Date().toISOString(); // 今天作為結束日期

    // 發送請求到後端，取得營業額和訂單總數
    fetch(`/api/orders/overview?startDate=${startDate}&endDate=${endDate}`)
      .then((response) => response.json())
      .then((data) => {
        // 更新營業額卡片中的值
        document.querySelector('[data-type="revenue"] p').textContent =
          data.revenue;
        // 更新訂單總數卡片中的值
        document.querySelector('[data-type="orders"] p').textContent =
          data.ordersCount;
      })
      .catch((error) => console.error("Error fetching overview data:", error));
  }

  // 初始化頁面時顯示數據
  fetchOverviewData(timeRange);

  // 動態生成總覽卡片的 section
  const overviewSection = document.createElement("section");
  overviewSection.className = "overview";

  const cardData = [
    { type: "revenue", title: "營業額", value: "0" },
    { type: "orders", title: "訂單總量", value: "0" },
    { type: "users", title: "總用戶數", value: "29,556" }, // 假設這裡數據固定
  ];

  // 動態生成卡片
  cardData.forEach((card) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    cardDiv.setAttribute("data-type", card.type);

    const h2 = document.createElement("h2");
    h2.textContent = card.title;

    const p = document.createElement("p");
    p.textContent = card.value;

    cardDiv.appendChild(h2);
    cardDiv.appendChild(p);

    overviewSection.appendChild(cardDiv);
  });

  // 將 overview section 插入到 main-content
  mainContent.appendChild(overviewSection);

  // 動態生成圖表區域的 section
  const chartSection = document.createElement("section");
  chartSection.className = "chart-section";

  const chartHeader = document.createElement("div");
  chartHeader.className = "chart-header";

  const chartTitle = document.createElement("h3");
  chartTitle.textContent = "圖表";

  const controlsDiv = document.createElement("div");
  controlsDiv.className = "controls";

  // 生成下載按鈕
  const downloadButton = document.createElement("button");
  downloadButton.id = "downloadButton";
  downloadButton.textContent = "下載報表";

  // 生成下拉選單
  const timeRangeSelect = document.createElement("select");
  timeRangeSelect.id = "timeRange";

  const timeOptions = [
    { value: "week", text: "周" },
    { value: "month", text: "月" },
    { value: "year", text: "年" },
  ];

  timeOptions.forEach((optionData) => {
    const option = document.createElement("option");
    option.value = optionData.value;
    option.textContent = optionData.text;
    timeRangeSelect.appendChild(option);
  });

  controlsDiv.appendChild(downloadButton);
  controlsDiv.appendChild(timeRangeSelect);

  // 將 chart header 部分組合起來
  chartHeader.appendChild(chartTitle);
  chartHeader.appendChild(controlsDiv);

  // 生成 canvas 元素
  const canvas = document.createElement("canvas");
  canvas.id = "orderChart";

  // 組合 chart section
  chartSection.appendChild(chartHeader);
  chartSection.appendChild(canvas);

  // 將 chart section 插入到 main-content
  mainContent.appendChild(chartSection);

  // 為時間範圍選擇添加事件監聽
  timeRangeSelect.addEventListener("change", function () {
    timeRange = this.value; // 更新時間範圍
    fetchOverviewData(timeRange); // 請求數據
  });

  // 初始化圖表
  initChart();
}

// 點擊"訂單管理"時生成內容的函數
function generateOrderManagementContent() {
  const mainContent = document.querySelector(".main-content");
  mainContent.innerHTML = ""; // 清空之前的內容

  // 動態生成訂單管理的標題和控制選項
  const orderManagementSection = `
        <section class="order-management">
            <h1>訂單管理</h1>
            <div class="orderControls">
                <label>每頁顯示結果數：</label>
                <select id="resultsPerPage">
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>

                <label>排序：</label>
                <select id="sortOrder">
                    <option value="orderDate,desc">訂單日期(遞減)</option>
                    <option value="orderDate,asc">訂單日期(遞增)</option>
                    <option value="totalAmount,desc">訂單金額(遞減)</option>
                    <option value="totalAmount,asc">訂單金額(遞增)</option>
                </select>

                <label>狀態：</label>
                <select id="orderStatus">
                    <option value="all">全部</option>
                    <option value="completed">已付款</option>
                    <option value="cancelled">取消</option>
                </select>
            </div>

            <!-- 訂單表格 -->
            <table class="order-table">
                <thead>
                    <tr>
                        <th>商品名稱</th>
                        <th>訂單資訊</th>
                        <th>訂單狀態</th>
                        <th>訂單時間</th>
                        <th>詳細</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- 這裡插入動態生成的訂單 -->
                </tbody>
            </table>

            <!-- 頁數切換的下拉選單 -->
            <div class="pagination-controls" style="text-align: right; margin-top: 20px;">
                <label for="pageSelect">選擇頁數：</label>
                <select id="pageSelect" style="border-radius: 5px; border: 1px solid #ccc;">
                    <!-- 動態生成頁數選項 -->
                </select>
            </div>
        </section>
    `;
  mainContent.innerHTML = orderManagementSection;

  const tbody = document.querySelector(".order-table tbody");
  const resultsPerPageSelect = document.getElementById("resultsPerPage");
  const sortOrderSelect = document.getElementById("sortOrder");
  const orderStatusSelect = document.getElementById("orderStatus");
  const pageSelect = document.getElementById("pageSelect");

  // 設置初始條件
  let resultsPerPage = parseInt(resultsPerPageSelect.value);
  let sortField = sortOrderSelect.value.split(",")[0]; // 獲取排序字段
  let sortDirection = sortOrderSelect.value.split(",")[1]; // 獲取排序方向
  let orderStatus = orderStatusSelect.value;
  let currentPage = 1;

  // 調用後端 API 獲取數據
  function fetchOrders() {
    let url = `/api/orders/page?page=${
      currentPage - 1
    }&size=${resultsPerPage}&sortField=${sortField}&sortDirection=${sortDirection}`;

    if (orderStatus !== "all") {
      url += `&status=${orderStatus}`;
    }

    fetch(url)
      .then((response) => {
        // 檢查回應是否為成功
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        renderOrders(data.content); // 渲染訂單
        updatePagination(data.totalPages); // 更新分頁

        // 防止無限迴圈的邏輯
        if (currentPage >= data.totalPages) {
          console.log("已到達最後一頁，停止加載");
          return;
        }

        // 當有下一頁時，自動加載
        if (currentPage < data.totalPages - 1) {
          currentPage++; // 自增當前頁數
          fetchNextPage(); // 調用函數加載下一頁
        }
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: red;">無法獲取訂單資料</td></tr>`;
      });
  }

  // 渲染訂單
  function renderOrders(orders) {
    tbody.innerHTML = ""; // 清空表格內容

    // 確保 orders 不為 undefined 或 null
    if (!orders || orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center;">目前沒有訂單資料</td></tr>`;
      return;
    }

    orders.forEach((order) => {
      const tr = document.createElement("tr");

      // 訂單名稱，如果 order.name 不存在，顯示 '無名稱'
      const orderName = order.name ? order.name : "無名稱";

      // 訂單配送方式，如果 order.deliveryMethod 不存在，顯示 '無配送方式'
      const deliveryMethod = order.deliveryMethod
        ? order.deliveryMethod
        : "到府";

      // 訂單日期格式化，如果 order.orderDate 存在
      const orderDate = order.orderDate
        ? new Date(order.orderDate).toLocaleDateString()
        : "無日期";

      tr.innerHTML = `
            <td>
                <p>${orderName}</p>
            </td>
            <td>
                訂單編號: ${order.orderId}<br>
                配送方式: ${deliveryMethod}<br>
                訂單金額: ${order.totalAmount}
            </td>
            <td>${order.status}</td>
            <td>${orderDate}</td>
            <td><a href="#" class="details-link" data-id="${order.orderId}" style="color: white;">詳細</a></td>
        `;

      tbody.appendChild(tr);
    });

    // 綁定「詳細」按鈕的點擊事件
    document.querySelectorAll(".details-link").forEach((link) => {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        const orderId = this.getAttribute("data-id");
        // 顯示訂單詳情頁面
        // generateOrderDetailsContent(orderId);

        // 發送 fetch 請求到 API，根據 orderId 獲取訂單詳細資料
        fetch(`/api/orders/${orderId}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // 解析成 JSON 格式
          })
          .then((orderData) => {
            // 將返回的訂單資料傳遞給生成訂單詳情頁面的函數
            generateOrderDetailsContent(orderData);
          })
          .catch((error) => {
            console.error("Error fetching order details:", error);
          });
      });
    });
  }

  // 動態生成頁數選項
  function updatePagination(totalPages) {
    pageSelect.innerHTML = ""; // 清空頁數選項
    for (let i = 1; i <= totalPages; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = `第 ${i} 頁`;
      pageSelect.appendChild(option);
    }
    pageSelect.value = currentPage; // 設定當前頁數
  }

  // 更新顯示結果數或排序方式時，重新調用 API 並渲染
  resultsPerPageSelect.addEventListener("change", () => {
    resultsPerPage = parseInt(resultsPerPageSelect.value);
    currentPage = 1;
    fetchOrders();
  });

  sortOrderSelect.addEventListener("change", () => {
    const sortValues = sortOrderSelect.value.split(",");
    sortField = sortValues[0];
    sortDirection = sortValues[1];
    currentPage = 1;
    fetchOrders();
  });

  orderStatusSelect.addEventListener("change", () => {
    orderStatus = orderStatusSelect.value;
    currentPage = 1;
    fetchOrders();
  });

  pageSelect.addEventListener("change", () => {
    currentPage = parseInt(pageSelect.value);
    fetchOrders();
  });

  // 初始加載數據
  fetchOrders();
}

// 點擊訂單的"詳細"連結後生成訂單詳情頁面的函數
function generateOrderDetailsContent(order) {
  const mainContent = document.querySelector(".main-content");
  mainContent.innerHTML = ""; // 清空之前的內容

  const userInfo = order
    ? `
        <p><strong>用戶名稱:</strong> ${order.username || "未提供"}</p>
        <p><strong>電子郵件:</strong> ${order.email || "未提供"}</p>
        <p><strong>電話號碼:</strong> ${order.phoneNumber || "未提供"}</p>
    `
    : `<p>無法找到該用戶資訊</p>`;

  const orderDetailsSection = `
        <section class="order-details">
            <h1>訂單詳情 - 訂單編號: ${order.orderNumber}</h1>
            <div class="order-and-user-info">
                <div class="order-info">
                    <h2>訂單資訊</h2>
                    <div class="order-summary">
                        <p><strong>訂單日期:</strong> ${order.orderDate}</p>
                        <p><strong>配送地址:</strong> ${order.address}</p>
                        <p><strong>訂單總金額:</strong> $${
                          order.totalAmount
                        }</p>
                        <p><strong>優惠券 ID:</strong> ${
                          order.couponId || "N/A"
                        }</p>
                        <p><strong>百分比折扣:</strong> ${
                          order.percentageDiscount
                        }%</p>
                        <p><strong>折扣金額:</strong> $${
                          order.amountDiscount
                        }</p>
                        <p><strong>最終金額:</strong> $${order.finalAmount}</p>
                        <p><strong>訂單狀態:</strong> ${order.status}</p>
                        <p><strong>修改者:</strong> ${order.changedBy}</p>
                        <p><strong>修改時間:</strong> ${order.changedAt}</p>
                        <p><strong>備註:</strong> ${order.comment || "無"}</p>
                    </div>
                </div>
                <div class="user-info2">
                    <h2>買家資訊</h2>
                    ${userInfo}
                </div>
            </div>
            <h2>購買商品</h2>
            <table class="order-items-table">
                <thead>
                    <tr>
                        <th>商品圖片</th>
                        <th>名稱</th>
                        <th>SKU</th>
                        <th>數量</th>
                        <th>價格</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- 動態生成的商品將插入到這裡 -->
                </tbody>
            </table>
        </section>
    `;

  mainContent.innerHTML = orderDetailsSection;

  // 選取表格的 tbody
  const tbody = document.querySelector(".order-items-table tbody");

  // 確認 orderDetails 存在且是陣列
  if (order.orderDetails && order.orderDetails.length > 0) {
    order.orderDetails.forEach((orderDetails) => {
      // 確保圖片存在，若無圖片則顯示預設圖片
      const productImage =
        orderDetails.product.images && orderDetails.product.images.length > 0
          ? orderDetails.product.images[0].url // 假設 image 是一個物件，且您需要取得 URL
          : "/path/to/default-image.png"; // 預設圖片路徑

      const tr = document.createElement("tr");
      tr.innerHTML = `
                <td><img src="${productImage}" alt="${orderDetails.product.name}" style="width: 50px; height: 50px;"></td>
                <td>${orderDetails.product.name}</td>
                <td>${orderDetails.product.sku}</td>
                <td>${orderDetails.quantity}</td>
                <td>$${orderDetails.price}</td>
            `;
      tbody.appendChild(tr); // 將每個商品插入到表格中
    });
  } else {
    console.warn("沒有購買商品");
  }
}

// 點擊"商品上傳"時生成內容的函數
function generateProductUploadForm() {
  const mainContent = document.querySelector(".main-content");
  mainContent.innerHTML = ""; // 清空之前的內容

  const productUploadForm = `
        <section class="product-upload">
            <h1>商品上傳</h1>
            <form>
                 <div class="image-upload">
                    <div class="image-preview">
                    <input type="file" />
                    </div>
                 </div>

                <div class="form-group">
                    <label for="name">商品名稱</label>
                    <textarea id="name" rows="1" placeholder="商品名稱"></textarea>
                </div>

                <div class="form-group">
                    <label for="sku" id="skulabel">SKU</label>
                    <textarea id="sku" rows="1"></textarea>
                </div>

                <!-- 類別選擇 -->
                <div class="form-group">
                    <label for="type">商品類型</label>
                    <select id="type">
                        <option value="preparedFood">調理包</option>
                        <option value="mealkit">食材包</option>
                    </select>
                </div>

                <!-- 菜品分類選擇 -->
                <div class="form-group">
                    <label for="category">菜品分類</label>
                    <select id="category">
                        <option value="5">家常料理</option>
                        <option value="3">兒童友善</option>
                        <option value="4">銀髮友善</option>
                        <option value="1">異國料理</option>
                        <option value="2">多人料理</option>
                    </select>
                </div>

                <!-- 商品描述 -->
                <div class="form-group">
                    <label for="description">商品描述</label>
                    <textarea id="description" rows="8"></textarea>
                </div>

                <div class="form-group">
                    <label for="price">價格</label>
                    <textarea id="price" rows="1" placeholder="價格"></textarea>
                </div>

                <!-- 庫存 -->
                <div class="form-group">
                    <label for="stockQuantity">庫存數量</label>
                    <textarea id="stockQuantity" rows="1" placeholder="庫存"></textarea>
                </div>

                <!-- 提交與取消按鈕 -->
                <div class="form-group">
                    <button type="submit" id="submitButton">確認</button>
                    <button type="reset" id="cancelButton">取消</button>
                </div>
            </form>
        </section>
    `;
  mainContent.innerHTML = productUploadForm;

  function uploadProduct(productData) {
    fetch(`http://localhost:8080/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
      mode: "cors",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("上傳商品失敗");
        }
        return response.json();
      })
      .then((result) => {
        console.log("商品上傳成功", result);
        Swal.fire({
          title: "Upload Success",
          text: `「成功上傳${productData.name}」商品`,
          icon: "success",
          timer: 1500,
        });
      })
      .catch((error) => {
        console.error("上傳商品時發生錯誤", error);
        Swal.fire({
          title: "Upload Failed",
          text: `「上傳${productData.name}」商品失敗`,
          icon: "error",
          timer: 1500,
        });
      });
    generateProductUploadForm();
  }

  // 綁定事件監聽器
  const submitButton = document.getElementById("submitButton");
  if (submitButton) {
    submitButton.addEventListener("click", (event) => {
      event.preventDefault(); // 防止表單提交刷新頁面

      const productData = {
        type: document.getElementById("type").value,
        sku: document.getElementById("sku").value,
        name: document.getElementById("name").value,
        description: document.getElementById("description").value,
        price: parseInt(document.getElementById("price").value),
        category: {
          categoryId: parseInt(document.getElementById("category").value),
        },
        stockQuantity: parseInt(document.getElementById("stockQuantity").value),
        isDel: false, //這是固定的值
      };
      uploadProduct(productData); // 在按鈕點擊後調用上傳功能
    });
  } else {
    console.error("submitButton 元素未找到");
  }
}

// 點擊"商品管理"時生成內容的函數
function generateProductManagementWithActionsContent() {
  const mainContent = document.querySelector(".main-content");
  mainContent.innerHTML = ""; // 清空之前的內容

  // 動態生成商品管理的標題和表格
  const productManagementSection = `
    <section class="product-management">
        <h1>商品管理</h1>
        <div class="orderControls">
            <label>搜尋商品：</label>
            <input type="text" id="productSearchInput" placeholder="輸入名稱或SKU" class="SearchInput">

            <label>每頁顯示結果數：</label>
            <select id="resultsPerPage">
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>

            <label>排序：</label>
            <select id="sortOrder">
                <option value="default">預設排序</option>
                <option value="skuASC">SKU (A-Z)</option>
                <option value="skuDESC">SKU (Z-A)</option>
                <option value="stockValuesASC">庫存量(遞增)</option>
                <option value="stockValuesDESC">庫存量(遞減)</option>
                <option value="priceASC">價格(遞增)</option>
                <option value="priceDESC">價格(遞減)</option>
            </select>

            <label>狀態：</label>
            <select id="productStatus">
                <option value="all">全部</option>
                <option value="stockNull">零庫存</option>
            </select>
        </div>

        <!-- 商品表格 -->
        <table class="product-table">
            <thead>
                <tr>
                    <th>商品圖片</th>
                    <th>productId</th>
                    <th>SKU</th>
                    <th>商品名稱</th>
                    <th>價格</th>
                    <th>庫存</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <!-- 這裡插入動態生成的商品 -->
            </tbody>
        </table>

        <!-- 頁數切換的下拉選單 -->
        <div class="pagination-controls" style="text-align: right; margin-top: 20px;">
            <label for="pageSelect">選擇頁數：</label>
            <select id="pageSelect" style="border-radius: 5px; border: 1px solid #ccc;">
                <!-- 動態生成頁數選項 -->
            </select>
        </div>
    </section>
`;
  mainContent.innerHTML = productManagementSection;

  const tbody = document.querySelector(".product-table tbody");
  const resultsPerPageSelect = document.getElementById("resultsPerPage");
  const sortOrderSelect = document.getElementById("sortOrder"); // 取得排序選項
  const productStatusSelect = document.getElementById("productStatus"); // 取得狀態選項
  const pageSelect = document.getElementById("pageSelect");
  const searchInput = document.getElementById("productSearchInput");

  // 設置每頁顯示的商品數量
  let products = [];
  let resultsPerPage = parseInt(resultsPerPageSelect.value);
  let currentPage = 1; // 預設為第 1 頁
  let totalPages = Math.ceil(products.length / resultsPerPage);

  fetch(`http://localhost:8080/products`)
    .then((response) => {
      if (!response.ok) {
        throw new error("無法獲取現有商品清單");
      }
      return response.json();
    })
    .then((data) => {
      if (data.length === 0) {
        console.log("目前沒有可顯示的商品");
        tbody.innerHTML = `<tr><td colspan="6">目前沒有商品資料</td></tr>`;
      } else {
        products = data;
        updatePagination(products);
        filterProductsByStatus();
        sortProducts();
        renderProducts(products);
      }
    })
    .catch((error) => {
      console.error("獲取商品清單發生錯誤", error);
    });

  // 根據狀態篩選商品
  function filterProductsByStatus(status) {
    if (status === "all") return products; // 如果選擇"全部"，返回所有商品
    return products.filter((product) => product.stock === 0);
  }

  // 根據排序選項對商品進行排序
  function sortProducts(productsList, sortBy) {
    if (sortBy === "priceASC") {
      return productsList.sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceDESC") {
      return productsList.sort((a, b) => b.price - a.price);
    } else if (sortBy === "stockValuesASC") {
      return productsList.sort((a, b) => a.stockQuantity - b.stockQuantity);
    } else if (sortBy === "stockValuesDESC") {
      return productsList.sort((a, b) => b.stockQuantity - a.stockQuantity);
    } else if (sortBy === "skuASC") {
      // 按 SKU 升序排序
      return productsList.sort((a, b) => a.sku.localeCompare(b.sku));
    } else if (sortBy === "skuDESC") {
      // 按 SKU 降序排序
      return productsList.sort((a, b) => b.sku.localeCompare(a.sku));
    } else if (sortBy === "default") {
      // 預設排序，根據 productId 升序
      return productsList.sort((a, b) => a.productId - b.productId);
    }

    return productsList;
  }

  // 渲染篩選和排序後的商品
  function renderFilteredAndSortedProducts() {
    let filteredProducts = filterProductsByStatus(productStatusSelect.value); // 先篩選
    let sortedProducts = sortProducts(filteredProducts, sortOrderSelect.value); // 再排序
    updatePagination(sortedProducts);
    renderProducts(sortedProducts);
  }

  // 動態生成頁數選項
  function updatePagination(filteredProducts) {
    pageSelect.innerHTML = ""; // 清空頁數選項
    totalPages = Math.ceil(filteredProducts.length / resultsPerPage); // 更新總頁數
    for (let i = 1; i <= totalPages; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = `第 ${i} 頁`;
      pageSelect.appendChild(option);
    }
    pageSelect.value = currentPage; // 設定當前頁數
  }

  // 動態生成每個商品的表格行  渲染商品函數
  function renderProducts(filteredProducts) {
    tbody.innerHTML = ""; // 清空表格內容
    const start = (currentPage - 1) * resultsPerPage;
    const end = start + resultsPerPage;
    const visibleProducts = filteredProducts.slice(start, end);

    visibleProducts.forEach((product, index) => {
      const tr = document.createElement("tr");
      const imageSrc = product.productImages?.[0]?.image
        ? `data:image/jpeg;base64,${product.productImages?.[0]?.image}`
        : "./donut.png";

      tr.innerHTML = `
            <td><img src="${imageSrc}" alt="${
        product.name
      }"  style="height: 80px; width: 80px"></td>
            <td>${product.productId}</td>
            <td>${product.sku}</td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>${product.stockQuantity}</td>
            <td class="actions">
                <button class="edit-button" data-index="${
                  start + index
                }">修改</button>
                <button class="delete-button" data-index="${
                  start + index
                }">刪除</button>
            </td>
        `;

      tbody.appendChild(tr);
    });

    // 重新綁定「修改」按鈕事件
    document.querySelectorAll(".edit-button").forEach((button) => {
      button.addEventListener("click", function () {
        const productIndex = this.getAttribute("data-index");
        generateProductManagementEdit(products[productIndex]); // 調用商品修改頁面並傳入對應商品數據
      });
    });

    // 重新綁定「刪除」按鈕事件
    document.querySelectorAll(".delete-button").forEach((button) => {
      button.addEventListener("click", function () {
        const productIndex = this.getAttribute("data-index");
        const productId = products[productIndex].productId;
        const productName = products[productIndex].name;

        Swal.fire({
          title: "注意",
          text: `你確定要刪除「${productName}」商品`,
          icon: "warning",
          showCancelButton: true, // 顯示"取消"按鈕的意思
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "確定",
          cancelButtonText: "取消",
        }).then((result) => {
          if (result.isConfirmed) {
            fetch(`http://localhost:8080/products/${productId}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error("刪除商品失敗");
                }
                return response.text();
              })
              .then(() => {
                Swal.fire({
                  title: "Deleted!",
                  text: `刪除「${productName}」商品成功`,
                  icon: "success",
                  timer: 1500,
                });
                products.splice(productIndex, 1);
                generateProductManagementWithActionsContent(); // 刷新商品管理頁面
              })
              .catch((error) => {
                console.error("刪除商品時發生錯誤");
                Swal.fire({
                  title: "Failed!",
                  text: `刪除「${productName}」商品失敗`,
                  icon: "error",
                  timer: 1500,
                });
                generateProductManagementWithActionsContent(); // 刷新商品管理頁面
              });
          }
        });
      });
    });

    // 搜尋商品
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase();
      const filteredProducts = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.sku.toLowerCase().includes(searchTerm)
      );
      currentPage = 1; // 搜尋時將頁面重置到第 1 頁
      updatePagination(filteredProducts);
      renderProducts(filteredProducts);
    });

    // 更新顯示結果數時，重新計算頁數並渲染
    resultsPerPageSelect.addEventListener("change", () => {
      resultsPerPage = parseInt(resultsPerPageSelect.value);
      currentPage = 1; // 切換每頁顯示數時，返回到第 1 頁
      const filteredProducts = products;
      updatePagination(filteredProducts);
      renderProducts(filteredProducts);
    });

    // 監聽頁數切換事件
    pageSelect.addEventListener("change", () => {
      currentPage = parseInt(pageSelect.value);
      const filteredProducts = products;
      renderProducts(filteredProducts);
    });

    // 監聽排序選項變更事件
    sortOrderSelect.addEventListener("change", () => {
      currentPage = 1;
      renderFilteredAndSortedProducts();
    });

    // 監聽狀態選項變更事件
    productStatusSelect.addEventListener("change", () => {
      currentPage = 1;
      renderFilteredAndSortedProducts();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    const editProductButton = document.getElementById("editProductButton");

    if (editProductButton) {
      editProductButton.addEventListener("click", function (event) {
        event.preventDefault(); // 防止跳轉
        generateProductManagementWithActionsContent(); // 調用生成商品管理頁面的函數
      });
    } else {
      console.error("editProductButton 元素未找到");
    }
  });

  // 商品管理部分(點擊"商品管理-修改"時生成內容的函數)
  function generateProductManagementEdit(product) {
    const mainContent = document.querySelector(".main-content");
    mainContent.innerHTML = ""; // 清空之前的內容

    // 動態生成商品修改的表單
    const productEditForm = `
      <section class="product-edit">
          <h1>修改商品 - ${product.name}</h1>
          <div class="image-upload">
              <div class="image-preview">
                  <img src="${
                    product.image
                  }" alt="商品圖片" style="width: 100%; height: auto;">
                  <button id="uploadImageButton">上傳新圖片</button>
              </div>
          </div>

          <form>
              <div class="form-group">
                  <label for="productId">productId</label>
                  <textarea id="productId" rows="1" readonly>${
                    product.productId
                  }</textarea>
              </div>
              <div class="form-group">
                  <label for="sku">SKU</label>
                  <textarea id="sku" rows="1" readonly>${product.sku}</textarea>
              </div>

              <div class="form-group">
                  <label for="name">商品名稱</label>
                  <textarea id="name" rows="1">${product.name}</textarea>
              </div>

              <div class="form-group">
                  <label for="type">商品類型</label>
                  <select id="type">
                      <option value="mealkit" ${
                        product.type === "調理包" ? "selected" : ""
                      }>調理包</option>
                      <option value="preparedFood" ${
                        product.type === "食材包" ? "selected" : ""
                      }>食材包</option>
                  </select>
              </div>
              
              <div class="form-group">
                  <label for="category">菜品分類</label>
                  <select id="category">
                      <option value="5" ${
                        product.category === "家常料理" ? "selected" : ""
                      }>家常料理</option>
                      <option value="3" ${
                        product.category === "兒童友善" ? "selected" : ""
                      }>兒童友善</option>
                      <option value="4" ${
                        product.category === "銀髮友善" ? "selected" : ""
                      }>銀髮友善</option>
                      <option value="1" ${
                        product.category === "異國料理" ? "selected" : ""
                      }>異國料理</option>
                      <option value="2" ${
                        product.category === "多人料理" ? "selected" : ""
                      }>多人料理</option>
                  </select>
              </div>

              <div class="form-group">
                  <label for="description">商品描述</label>
                  <textarea id="description" rows="4">${
                    product.description
                  }</textarea>
              </div>

              <div class="form-group">
                  <label for="price">價格</label>
                  <textarea id="price" rows="1">${product.price}</textarea>
              </div>

              <div class="form-group">
                  <label for="stockQuantity">庫存數量</label>
                  <textarea id="stockQuantity" rows="1">${
                    product.stockQuantity
                  }</textarea>
              </div>


              <div class="form-group">
                  <button type="button" id="submitButton">保存修改</button>
                  <button type="button" id="cancelButton">取消</button>
              </div>
          </form>
      </section>
  `;
    mainContent.innerHTML = productEditForm;

    document
      .getElementById("submitButton")
      .addEventListener("click", function (event) {
        event.preventDefault();
        updateProductDetails(product);
      });

    // 綁定取消按鈕事件
    document
      .getElementById("cancelButton")
      .addEventListener("click", function () {
        generateProductManagementWithActionsContent(); // 返回商品管理頁面
      });
  }

  function updateProductDetails(product) {
    const updatedProduct = {
      productId: parseInt(document.getElementById("productId").value),
      sku: document.getElementById("sku").value,
      name: document.getElementById("name").value,
      type: document.getElementById("type").value,
      category: {
        categoryId: parseInt(document.getElementById("category").value),
      },
      price: parseInt(document.getElementById("price").value),
      description: document.getElementById("description").value,
      stockQuantity: parseInt(document.getElementById("stockQuantity").value),
    };
    updateProduct(updatedProduct);
  }

  function updateProduct(productData) {
    fetch(`http://localhost:8080/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
      mode: "cors",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("修改商品失敗");
        }
        return response.json();
      })
      .then((result) => {
        console.log("商品修改成功", result);
        Swal.fire({
          title: "成功",
          text: `「成功修改${productData.name}」商品資訊`,
          icon: "success",
          timer: 1500,
        });
        generateProductManagementWithActionsContent(); // 返回商品管理頁面
      })
      .catch((error) => {
        console.error("修改商品時發生錯誤", error);
        Swal.fire({
          title: "錯誤",
          text: `修改${productData.name}商品資訊時發生錯誤`,
          icon: "error",
          timer: 1500,
        });
      });
  }
}
// 如果需要處理圖片上傳，可以在這裡添加事件監聽器
// document
//   .getElementById("uploadImageButton")
//   .addEventListener("click", function () {
//     // 這裡可以添加圖片上傳的功能
//     alert("上傳新圖片的功能尚未實現。");
//   });

// 點擊"食譜上傳"時生成內容的函數
function generateRecipeUploadForm() {
  const mainContent = document.querySelector(".main-content");
  mainContent.innerHTML = ""; // 清空之前的內容

  const productUploadForm = `
        <section class="product-upload">
            <h1>食譜上傳</h1>
            <div class="image-upload">
                <div class="image-preview">
                <img src="橘大頭.png" alt="商品圖片" style="width: 100%; height: auto;">
                <img src="紅大頭.png" alt="商品圖片" style="width: 100%; height: auto;">
                <img src="深綠大頭.png" alt="商品圖片" style="width: 100%; height: auto;">
                <img src="黃大頭.png" alt="商品圖片" style="width: 100%; height: auto;">
                <button id="uploadImageButton">圖片上傳</button>
                </div>
            </div>

            <form>
                <div class="form-group">
                    <label for="description">食譜名稱</label>
                    <textarea id="description" rows="1" placeholder="食譜名稱"></textarea>
                </div>
            
                <!-- 類別選擇 -->
                <div class="form-group">
                    <label for="category">菜品分類</label>
                    <select id="category">
                        <option value="category1">家常料理</option>
                        <option value="category2">兒童友善</option>
                        <option value="category3">銀髮友善</option>
                        <option value="category4">異國料理</option>
                        <option value="category5">多人料理</option>
                    </select>
                </div>

                <!-- 人數、難度等選項 -->
                <div class="form-group row-group">
                    <div class="field">
                        <label for="people">人數</label>
                        <select id="people">
                            <option value="1">1人</option>
                            <option value="2">2人</option>
                            <option value="3">3人</option>
                            <option value="4">4人</option>
                            <option value="5">5人</option>
                        </select>
                    </div>

                    <div class="field">
                        <label for="difficulty">難度</label>
                        <select id="difficulty">
                            <option value="easy">簡單</option>
                            <option value="medium">中等</option>
                            <option value="hard">困難</option>
                        </select>
                    </div>

                    <div class="field">
                        <label for="vagan">素食</label>
                        <select id="vagan">
                            <option value="no">否</option>
                            <option value="vagen">全素</option>
                            <option value="halfvagen">奶蛋素</option>
                        </select>
                    </div>

                    <div class="field time">
                        <label for="time">製作時間</label>
                        <textarea id="time" rows="1" class="time"></textarea>
                    </div>
                </div>

                <!-- 食譜描述 -->
                <div class="form-group">
                    <label for="description">食材</label>
                    <textarea id="description" rows="8"></textarea>
                </div>

                <!-- 食材與步驟 -->
                <div class="form-group">
                    <label for="ingredients">食譜步驟</label>
                    <textarea id="ingredients" rows="8"></textarea>
                </div>

                <div class="form-group">
                    <label for="steps">貼心小提醒</label>
                    <textarea id="steps" rows="8"></textarea>
                </div>

                <!-- 提交與取消按鈕 -->
                <div class="form-group">
                    <button type="submit" id="submitButton">確認</button>
                    <button type="reset" id="cancelButton">取消</button>
                </div>
            </form>
        </section>
    `;
  mainContent.innerHTML = productUploadForm;
}

// 點擊"食譜管理"時生成內容的函數
function generateRecipeManagementContent() {
  const mainContent = document.querySelector(".main-content");
  mainContent.innerHTML = ""; // 清空之前的內容

  // 動態生成食譜管理的標題和表格
  const recipeManagementSection = `
        <section class="recipe-management">
            <h1>食譜管理</h1>
            <div class="recipeControls">
                <label>搜尋商品：</label>
                <input type="text" id="productSearchInput" placeholder="輸入名稱" class="SearchInput">
                
                <label>每頁顯示結果數：</label>
                <select>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>

                <label>分類：</label>
                <select id="category">
                     <option value="category1">家常料理</option>
                     <option value="category2">兒童友善</option>
                     <option value="category3">銀髮友善</option>
                      <option value="category4">異國料理</option>
                      <option value="category5">多人料理</option>
                </select>
            </div>
            <table class="recipe-table">
                <thead>
                    <tr>
                        <th>圖片</th>
                        <th>名稱</th>
                        <th>描述</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- 這裡插入動態生成的食譜 -->
                </tbody>
            </table>
        </section>
    `;
  mainContent.innerHTML = recipeManagementSection;

  const tbody = document.querySelector(".recipe-table tbody");

  // 動態生成每個食譜的表格行
  recipes.forEach((recipe, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
            <td><img src="${recipe.image}" alt="${recipe.name}" class="recipe-image"></td>
            <td>${recipe.name}</td>
            <td style="max-width: 40vw;">${recipe.description}</td>
            <td class="actions">
                <button class="edit-button" data-index="${index}">修改</button>
                <button class="delete-button" data-index="${index}">刪除</button>
            </td>
        `;

    tbody.appendChild(tr);
  });

  // 重新為動態生成的「修改」按鈕綁定事件
  document.querySelectorAll(".edit-button").forEach((button) => {
    button.addEventListener("click", function () {
      const recipeIndex = this.getAttribute("data-index");
      generateRecipeEditForm(recipes[recipeIndex]); // 調用食譜修改頁面並傳入對應食譜數據
    });
  });

  // 重新為動態生成的「刪除」按鈕綁定事件
  document.querySelectorAll(".delete-button").forEach((button) => {
    button.addEventListener("click", function () {
      const recipeIndex = this.getAttribute("data-index");
      if (confirm("確定要刪除這個食譜嗎？")) {
        recipes.splice(recipeIndex, 1); // 刪除食譜
        generateRecipeManagementContent(); // 刷新食譜管理頁面
      }
    });
  });
}

// 點擊"食譜管理"時生成內容的函數
function generateRecipeManagementContent() {
  const mainContent = document.querySelector(".main-content");
  mainContent.innerHTML = ""; // 清空之前的內容

  // 動態生成食譜管理的標題和表格
  const recipeManagementSection = `
        <section class="recipe-management">
            <h1>食譜管理</h1>
            <div class="recipeControls">
                <label>搜尋食譜：</label>
                <input type="text" id="recipeSearchInput" placeholder="輸入名稱" class="SearchInput">
                
                <label>每頁顯示結果數：</label>
                <select id="resultsPerPage">
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>

                <label>分類：</label>
                <select id="category">
                    <option value="all">全部</option>
                    <option value="category1">家常料理</option>
                    <option value="category2">兒童友善</option>
                    <option value="category3">銀髮友善</option>
                    <option value="category4">異國料理</option>
                    <option value="category5">多人料理</option>
                </select>
            </div>
            <table class="recipe-table">
                <thead>
                    <tr>
                        <th>圖片</th>
                        <th>名稱</th>
                        <th>描述</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- 這裡插入動態生成的食譜 -->
                </tbody>
            </table>

            <!-- 分頁控制 -->
            <div class="pagination-controls" style="text-align: right; margin-top: 20px;">
                <label for="pageSelect">選擇頁數：</label>
                <select id="pageSelect" style="border-radius: 5px; border: 1px solid #ccc;">
                    <!-- 動態生成頁數選項 -->
                </select>
            </div>
        </section>
    `;
  mainContent.innerHTML = recipeManagementSection;

  const tbody = document.querySelector(".recipe-table tbody");
  const resultsPerPageSelect = document.getElementById("resultsPerPage");
  const pageSelect = document.getElementById("pageSelect");
  const searchInput = document.getElementById("recipeSearchInput");
  const categorySelect = document.getElementById("category");

  // 設置每頁顯示的食譜數量
  let resultsPerPage = parseInt(resultsPerPageSelect.value);
  let currentPage = 1; // 預設為第 1 頁
  let totalPages = Math.ceil(recipes.length / resultsPerPage);

  // 根據分類篩選食譜
  function filterRecipesByCategory(category) {
    if (category === "all") return recipes; // 如果選擇"全部"，返回所有食譜
    return recipes.filter((recipe) => recipe.category === category);
  }

  // 動態生成每個食譜的表格行
  function renderRecipes(filteredRecipes) {
    tbody.innerHTML = ""; // 清空表格內容
    const start = (currentPage - 1) * resultsPerPage;
    const end = start + resultsPerPage;
    const visibleRecipes = filteredRecipes.slice(start, end);

    visibleRecipes.forEach((recipe, index) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
                <td><img src="${recipe.image}" alt="${
        recipe.name
      }" class="recipe-image"></td>
                <td>${recipe.name}</td>
                <td style="max-width: 40vw;">${recipe.description}</td>
                <td class="actions">
                    <button class="edit-button" data-index="${
                      start + index
                    }">修改</button>
                    <button class="delete-button" data-index="${
                      start + index
                    }">刪除</button>
                </td>
            `;

      tbody.appendChild(tr);
    });

    // 綁定「修改」按鈕事件
    document.querySelectorAll(".edit-button").forEach((button) => {
      button.addEventListener("click", function () {
        const recipeIndex = this.getAttribute("data-index");
        generateRecipeEditForm(recipes[recipeIndex]); // 調用食譜修改頁面並傳入對應食譜數據
      });
    });

    // 綁定「刪除」按鈕事件
    document.querySelectorAll(".delete-button").forEach((button) => {
      button.addEventListener("click", function () {
        const recipeIndex = this.getAttribute("data-index");
        if (confirm("確定要刪除這個食譜嗎？")) {
          recipes.splice(recipeIndex, 1); // 刪除食譜
          generateRecipeManagementContent(); // 刷新食譜管理頁面
        }
      });
    });
  }

  // 動態生成頁數選項
  function updatePagination(filteredRecipes) {
    pageSelect.innerHTML = ""; // 清空頁數選項
    totalPages = Math.ceil(filteredRecipes.length / resultsPerPage); // 更新總頁數
    for (let i = 1; i <= totalPages; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = `第 ${i} 頁`;
      pageSelect.appendChild(option);
    }
    pageSelect.value = currentPage; // 設定當前頁數
  }

  // 搜尋食譜
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredRecipes = recipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(searchTerm)
    );
    currentPage = 1; // 搜尋時將頁面重置到第 1 頁
    updatePagination(filteredRecipes);
    renderRecipes(filteredRecipes);
  });

  // 分類篩選食譜
  categorySelect.addEventListener("change", () => {
    const selectedCategory = categorySelect.value;
    const filteredRecipes = filterRecipesByCategory(selectedCategory);
    currentPage = 1; // 篩選時頁數重置
    updatePagination(filteredRecipes);
    renderRecipes(filteredRecipes);
  });

  // 更新顯示結果數時，重新計算頁數並渲染
  resultsPerPageSelect.addEventListener("change", () => {
    resultsPerPage = parseInt(resultsPerPageSelect.value);
    currentPage = 1; // 切換每頁顯示數時，返回到第 1 頁
    const filteredRecipes = filterRecipesByCategory(categorySelect.value);
    updatePagination(filteredRecipes);
    renderRecipes(filteredRecipes);
  });

  // 監聽頁數切換事件
  pageSelect.addEventListener("change", () => {
    currentPage = parseInt(pageSelect.value);
    const filteredRecipes = filterRecipesByCategory(categorySelect.value);
    renderRecipes(filteredRecipes);
  });

  // 初始化頁面
  const filteredRecipes = filterRecipesByCategory(categorySelect.value);
  updatePagination(filteredRecipes);
  renderRecipes(filteredRecipes);
}

// 點擊"用戶管理"時生成內容的函數
function generateUserManagementContent() {
  const mainContent = document.querySelector(".main-content");
  mainContent.innerHTML = ""; // 清空之前的內容

  // 動態生成用戶管理的標題和表格
  const userManagementSection = `
        <section class="user-management">
            <h1>用戶管理</h1>
            <div class="userControls">
                <label>搜尋用戶：</label>
                <input type="text" id="userSearchInput" class="SearchInput" placeholder="輸入用戶名或電子郵件">

                <label>每頁顯示結果數：</label>
                <select id="resultsPerPage">
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>

                <label>排序：</label>
                <select id="sortOptions">
                    <option value="usernameASC">用戶名(遞增)</option>
                    <option value="usernameDESC">用戶名(遞減)</option>
                    <option value="createdAtASC">創建時間(遞增)</option>
                    <option value="createdAtDESC">創建時間(遞減)</option>
                </select>
            </div>
            <table class="user-table">
                <thead>
                    <tr>
                        <th>用戶ID</th>
                        <th>用戶名</th>
                        <th>電子郵件</th>
                        <th>電話號碼</th>
                        <th>創建時間</th>
                        <th>更新時間</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- 這裡插入動態生成的用戶 -->
                </tbody>
            </table>

            <!-- 分頁控制 -->
            <div class="pagination-controls" style="text-align: right; margin-top: 20px;">
                <label for="pageSelect">選擇頁數：</label>
                <select id="pageSelect">
                    <!-- 動態生成頁數選項 -->
                </select>
            </div>
        </section>
    `;
  mainContent.innerHTML = userManagementSection;

  const tbody = document.querySelector(".user-table tbody");
  const resultsPerPageSelect = document.getElementById("resultsPerPage");
  const pageSelect = document.getElementById("pageSelect");
  const searchInput = document.getElementById("userSearchInput");
  const sortOptions = document.getElementById("sortOptions");

  // 設置每頁顯示的用戶數量
  let resultsPerPage = parseInt(resultsPerPageSelect.value);
  let currentPage = 1; // 預設為第 1 頁
  let totalPages = Math.ceil(users.length / resultsPerPage);

  // 根據排序選項對用戶進行排序
  function sortUsers(usersList, sortBy) {
    if (sortBy === "usernameASC") {
      return usersList.sort((a, b) => a.username.localeCompare(b.username));
    } else if (sortBy === "usernameDESC") {
      return usersList.sort((a, b) => b.username.localeCompare(a.username));
    } else if (sortBy === "createdAtASC") {
      return usersList.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    } else if (sortBy === "createdAtDESC") {
      return usersList.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
    return usersList;
  }

  // 動態生成每個用戶的表格行
  function renderUsers(filteredUsers) {
    tbody.innerHTML = ""; // 清空表格內容
    const start = (currentPage - 1) * resultsPerPage;
    const end = start + resultsPerPage;
    const visibleUsers = filteredUsers.slice(start, end);

    visibleUsers.forEach((user, index) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
                <td>${user.userId}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.phoneNumber}</td>
                <td>${user.createdAt}</td>
                <td>${user.updatedAt}</td>
                <td class="actions">
                    <button class="edit-button" data-index="${
                      start + index
                    }">詳情</button>
                </td>
            `;

      tbody.appendChild(tr);
    });

    // 綁定「詳情」按鈕的事件
    document.querySelectorAll(".edit-button").forEach((button) => {
      button.addEventListener("click", function () {
        const userIndex = this.getAttribute("data-index");
        generateUserEditForm(users[userIndex]); // 調用用戶修改表單
      });
    });
  }

  // 動態生成頁數選項
  function updatePagination(filteredUsers) {
    pageSelect.innerHTML = ""; // 清空頁數選項
    totalPages = Math.ceil(filteredUsers.length / resultsPerPage); // 更新總頁數
    for (let i = 1; i <= totalPages; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = `第 ${i} 頁`;
      pageSelect.appendChild(option);
    }
    pageSelect.value = currentPage; // 設定當前頁數
  }

  // 搜尋用戶
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredUsers = users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
    );
    currentPage = 1; // 搜尋時將頁面重置到第 1 頁
    updatePagination(filteredUsers);
    renderUsers(filteredUsers);
  });

  // 排序功能
  sortOptions.addEventListener("change", () => {
    let filteredUsers = users;
    filteredUsers = sortUsers(filteredUsers, sortOptions.value);
    currentPage = 1; // 改變排序時返回到第 1 頁
    updatePagination(filteredUsers);
    renderUsers(filteredUsers);
  });

  // 更新顯示結果數時，重新計算頁數並渲染
  resultsPerPageSelect.addEventListener("change", () => {
    resultsPerPage = parseInt(resultsPerPageSelect.value);
    currentPage = 1; // 切換每頁顯示數時，返回到第 1 頁
    let filteredUsers = users;
    filteredUsers = sortUsers(filteredUsers, sortOptions.value);
    updatePagination(filteredUsers);
    renderUsers(filteredUsers);
  });

  // 監聽頁數切換事件
  pageSelect.addEventListener("change", () => {
    currentPage = parseInt(pageSelect.value);
    let filteredUsers = users;
    filteredUsers = sortUsers(filteredUsers, sortOptions.value);
    renderUsers(filteredUsers);
  });

  // 初始化頁面
  let filteredUsers = users;
  filteredUsers = sortUsers(filteredUsers, sortOptions.value);
  updatePagination(filteredUsers);
  renderUsers(filteredUsers);
}

// 點擊"用戶管理"時生成內容的函數
function generateUserManagementContent() {
  const mainContent = document.querySelector(".main-content");
  mainContent.innerHTML = ""; // 清空之前的內容

  // 動態生成用戶管理的標題和表格
  const userManagementSection = `
        <section class="user-management">
            <h1>用戶管理</h1>
            <div class="userControls">
                <label>搜尋用戶：</label>
                <input type="text" id="userSearchInput" class="SearchInput" placeholder="輸入用戶名或電子郵件">

                <label>每頁顯示結果數：</label>
                <select id="resultsPerPage">
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>

                <label>排序：</label>
                <select id="sortOptions">
                    <option value="usernameASC">用戶名(遞增)</option>
                    <option value="usernameDESC">用戶名(遞減)</option>
                    <option value="createdAtASC">創建時間(遞增)</option>
                    <option value="createdAtDESC">創建時間(遞減)</option>
                </select>
            </div>
            <table class="user-table">
                <thead>
                    <tr>
                        <th>用戶ID</th>
                        <th>用戶名</th>
                        <th>電子郵件</th>
                        <th>電話號碼</th>
                        <th>創建時間</th>
                        <th>更新時間</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- 這裡插入動態生成的用戶 -->
                </tbody>
            </table>

            <!-- 分頁控制 -->
            <div class="pagination-controls" style="text-align: right; margin-top: 20px;">
                <label for="pageSelect">選擇頁數：</label>
                <select id="pageSelect" style="border-radius: 5px; border: 1px solid #ccc;">
                    <!-- 動態生成頁數選項 -->
                </select>
            </div>
        </section>
    `;
  mainContent.innerHTML = userManagementSection;

  const tbody = document.querySelector(".user-table tbody");
  const resultsPerPageSelect = document.getElementById("resultsPerPage");
  const pageSelect = document.getElementById("pageSelect");
  const searchInput = document.getElementById("userSearchInput");
  const sortOptions = document.getElementById("sortOptions");

  // 設置每頁顯示的用戶數量
  let resultsPerPage = parseInt(resultsPerPageSelect.value);
  let currentPage = 1; // 預設為第 1 頁
  let totalPages = Math.ceil(users.length / resultsPerPage);

  // 根據排序選項對用戶進行排序
  function sortUsers(usersList, sortBy) {
    if (sortBy === "usernameASC") {
      return usersList.sort((a, b) => a.username.localeCompare(b.username));
    } else if (sortBy === "usernameDESC") {
      return usersList.sort((a, b) => b.username.localeCompare(a.username));
    } else if (sortBy === "createdAtASC") {
      return usersList.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    } else if (sortBy === "createdAtDESC") {
      return usersList.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
    return usersList;
  }

  // 動態生成每個用戶的表格行
  function renderUsers(filteredUsers) {
    tbody.innerHTML = ""; // 清空表格內容
    const start = (currentPage - 1) * resultsPerPage;
    const end = start + resultsPerPage;
    const visibleUsers = filteredUsers.slice(start, end);

    visibleUsers.forEach((user, index) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
                <td>${user.userId}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.phoneNumber}</td>
                <td>${user.createdAt}</td>
                <td>${user.updatedAt}</td>
                <td class="actions">
                    <button class="edit-button" data-index="${
                      start + index
                    }">詳情</button>
                </td>
            `;

      tbody.appendChild(tr);
    });

    // 綁定「詳情」按鈕的事件
    document.querySelectorAll(".edit-button").forEach((button) => {
      button.addEventListener("click", function () {
        const userIndex = this.getAttribute("data-index");
        generateUserEditForm(users[userIndex]); // 調用用戶修改表單
      });
    });
  }

  // 動態生成頁數選項
  function updatePagination(filteredUsers) {
    pageSelect.innerHTML = ""; // 清空頁數選項
    totalPages = Math.ceil(filteredUsers.length / resultsPerPage); // 更新總頁數
    for (let i = 1; i <= totalPages; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = `第 ${i} 頁`;
      pageSelect.appendChild(option);
    }
    pageSelect.value = currentPage; // 設定當前頁數
  }

  // 搜尋用戶
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredUsers = users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
    );
    currentPage = 1; // 搜尋時將頁面重置到第 1 頁
    updatePagination(filteredUsers);
    renderUsers(filteredUsers);
  });

  // 排序功能
  sortOptions.addEventListener("change", () => {
    let filteredUsers = users;
    filteredUsers = sortUsers(filteredUsers, sortOptions.value);
    currentPage = 1; // 改變排序時返回到第 1 頁
    updatePagination(filteredUsers);
    renderUsers(filteredUsers);
  });

  // 更新顯示結果數時，重新計算頁數並渲染
  resultsPerPageSelect.addEventListener("change", () => {
    resultsPerPage = parseInt(resultsPerPageSelect.value);
    currentPage = 1; // 切換每頁顯示數時，返回到第 1 頁
    let filteredUsers = users;
    filteredUsers = sortUsers(filteredUsers, sortOptions.value);
    updatePagination(filteredUsers);
    renderUsers(filteredUsers);
  });

  // 監聽頁數切換事件
  pageSelect.addEventListener("change", () => {
    currentPage = parseInt(pageSelect.value);
    let filteredUsers = users;
    filteredUsers = sortUsers(filteredUsers, sortOptions.value);
    renderUsers(filteredUsers);
  });

  // 初始化頁面
  let filteredUsers = users;
  filteredUsers = sortUsers(filteredUsers, sortOptions.value);
  updatePagination(filteredUsers);
  renderUsers(filteredUsers);
}

// 點擊"優惠券管理"時生成內容的函數
function generateCouponManagementForm() {
  const mainContent = document.querySelector(".main-content");
  mainContent.innerHTML = ""; // 清空之前的內容

  const couponManagementForm = `
        <section class="coupon-management">
            <h1>優惠券管理</h1>

            <!-- 新增優惠券表單 -->
            <form id="couponForm">
                <div class="form-group">
                    <label for="code">優惠券代碼</label>
                    <textarea id="code" rows="1" placeholder="輸入優惠券代碼"></textarea>
                </div>

                <div class="form-group">
                    <label for="name">優惠券名稱</label>
                    <textarea id="name" rows="1" placeholder="輸入優惠券名稱"></textarea>
                </div>

                <div class="form-group">
                    <label for="discountType">折扣類型</label>
                    <select id="discountType">
                        <option value="percentage">百分比折扣</option>
                        <option value="amount">固定金額折扣</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="discountValue">折扣值</label>
                    <textarea id="discountValue" rows="1" placeholder="輸入折扣值"></textarea>
                </div>

                <div class="form-group">
                    <label for="expiryDate">到期日期</label>
                    <input type="date" id="expiryDate">
                    <!-- 提交與取消按鈕 -->
                    <button type="submit" id="submitCouponButton">新增優惠券</button>
                    <button type="reset" id="cancelCouponButton">取消</button>
                </div>
            </form>

            <!-- 已經新增的優惠券列表 -->
            <section class="existing-coupons">
                <h1>已新增的優惠券</h1>
                <table class="coupon-table">
                    <thead>
                        <tr>
                            <th>優惠券代碼</th>
                            <th>名稱</th>
                            <th>折扣類型</th>
                            <th>折扣值</th>
                            <th>到期日期</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody id="couponTableBody">
                        <!-- 這裡插入動態生成的優惠券 -->
                    </tbody>
                </table>
            </section>
        </section>
    `;
  mainContent.innerHTML = couponManagementForm;

  // 儲存優惠券的陣列
  let coupons = [];

  // 優惠券表單提交處理
  const couponForm = document.getElementById("couponForm");
  couponForm.addEventListener("submit", function (event) {
    event.preventDefault(); // 阻止表單提交刷新

    // 獲取輸入的優惠券信息
    const code = document.getElementById("code").value;
    const name = document.getElementById("name").value;
    const discountType = document.getElementById("discountType").value;
    const discountValue = document.getElementById("discountValue").value;
    const expiryDate = document.getElementById("expiryDate").value;

    // 構造優惠券對象
    const couponData = {
      code,
      name,
      discountType,
      discountValue,
      expiryDate,
    };

    // 發送 POST 請求到後端
    fetch("localhost:8080/api/coupons/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(couponData),
    })
      .then((response) => response.json()) // 解析 JSON 回應
      .then((data) => {
        // 使用返回的優惠券陣列更新表格
        coupons = data; // 假設後端返回的是最新的優惠券列表
        displayCoupons(); // 顯示優惠券
      })
      .catch((error) => console.error("Error:", error));

    // 重置表單
    couponForm.reset();
  });

  // 顯示已新增的優惠券
  function displayCoupons() {
    const couponTableBody = document.getElementById("couponTableBody");
    couponTableBody.innerHTML = ""; // 清空之前的內容

    coupons.forEach((coupon, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
                <td>${coupon.code}</td>
                <td>${coupon.name}</td>
                <td>${
                  coupon.discountType === "percentage" ? "百分比" : "固定金額"
                }</td>
                <td>${coupon.discountValue}</td>
                <td>${coupon.expiryDate}</td>
                <td>
                    <button class="delete-coupon-button" data-index="${index}">刪除</button>
                </td>
            `;
      couponTableBody.appendChild(tr);
    });

    // 綁定刪除按鈕的事件
    document.querySelectorAll(".delete-coupon-button").forEach((button) => {
      button.addEventListener("click", function () {
        const index = this.getAttribute("data-index");

        // 顯示確認刪除的彈窗
        const isConfirmed = confirm("確定要刪除此優惠券嗎？");

        if (isConfirmed) {
          coupons.splice(index, 1); // 刪除該優惠券
          displayCoupons(); // 刷新優惠券表格
        }
      });
    });
  }
}

// 初始化圖表的函數
function initChart() {
  const ctx = document.getElementById("orderChart").getContext("2d");

  let chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      datasets: [
        {
          label: "每周營業額",
          data: [3000, 4000, 3500, 5000, 4500, 6000, 5500], // 初始數據
          backgroundColor: "rgba(136, 191, 75, 0.2)", // 綠色背景
          borderColor: "rgba(136, 191, 75, 1)", // 綠色邊框
          borderWidth: 2,
          pointBackgroundColor: "white",
          pointBorderColor: "rgba(136, 191, 75, 1)",
          pointBorderWidth: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          beginAtZero: true,
        },
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  let currentCard = "revenue"; // 初始化當前顯示的卡片類型

  // 為卡片添加點擊事件
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", function () {
      currentCard = this.getAttribute("data-type"); // 更新當前卡片類型
      const timeRange = document.getElementById("timeRange").value; // 獲取當前選擇的時間範圍
      const selectedData = chartData[currentCard][timeRange];

      // 更新圖表數據
      chart.data.labels = selectedData.labels;
      chart.data.datasets[0].data = selectedData.data;
      chart.data.datasets[0].label = selectedData.label;
      chart.update(); // 更新圖表
    });
  });

  // 為下拉選單添加事件監聽器
  const timeRangeSelect = document.getElementById("timeRange");
  timeRangeSelect.addEventListener("change", function () {
    const timeRange = this.value;
    const selectedData = chartData[currentCard][timeRange]; // 根據當前卡片和時間範圍獲取數據

    // 更新圖表數據和標籤
    chart.data.labels = selectedData.labels;
    chart.data.datasets[0].data = selectedData.data;
    chart.data.datasets[0].label = selectedData.label;
    chart.update(); // 更新圖表
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initChart();
});

document.addEventListener("DOMContentLoaded", function () {
  // 點擊logo時生成內容
  const logo = document.getElementById("logo");
  logo.addEventListener("click", function (event) {
    event.preventDefault(); // 防止跳轉
    generateOverviewContent(); // 調用生成函數
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // 點擊"總覽"按鈕時生成內容
  const overviewButton = document.getElementById("overviewButton");
  overviewButton.addEventListener("click", function (event) {
    event.preventDefault(); // 防止跳轉
    generateOverviewContent(); // 調用生成函數
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // 點擊"訂單管理"按鈕時生成內容
  const orderManagementButton = document.getElementById(
    "orderManagementButton"
  );
  orderManagementButton.addEventListener("click", function (event) {
    event.preventDefault(); // 防止跳轉
    generateOrderManagementContent(); // 調用生成訂單管理內容的函數
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // 點擊"商品上傳"按鈕時生成內容
  const uploadProductButton = document.getElementById("uploadProductButton");
  uploadProductButton.addEventListener("click", function (event) {
    event.preventDefault(); // 防止跳轉
    generateProductUploadForm(); // 調用生成商品上傳表單的函數
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // 點擊"食譜上傳"按鈕時生成內容
  const uploadRecipeButton = document.getElementById("uploadRecipeButton");
  uploadRecipeButton.addEventListener("click", function (event) {
    event.preventDefault(); // 防止跳轉
    generateRecipeUploadForm(); // 調用生成商品上傳表單的函數
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const editProductButton = document.getElementById("editProductButton");

  if (editProductButton) {
    editProductButton.addEventListener("click", function (event) {
      event.preventDefault(); // 防止跳轉
      generateProductManagementWithActionsContent(); // 調用生成商品管理頁面的函數
    });
  } else {
    console.error("editProductButton 元素未找到");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const editProductButton = document.getElementById("recipeEditButton");
  editProductButton.addEventListener("click", function (event) {
    event.preventDefault(); // 防止跳轉
    generateRecipeManagementContent(); // 調用生成食譜管理頁面的函數
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const manageStockButton = document.getElementById("userManagementButton");
  manageStockButton.addEventListener("click", function (event) {
    event.preventDefault(); // 防止跳轉
    generateUserManagementContent(); // 調用生成用戶管理頁面的函數
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const manageStockButton = document.getElementById("couponManagementButton");
  manageStockButton.addEventListener("click", function (event) {
    event.preventDefault(); // 防止跳轉
    generateCouponManagementForm(); // 調用生成優惠券管理頁面的函數
  });
});

// 為 "詳情" 按鈕添加點擊事件
document.querySelectorAll(".details-link").forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    const productIndex = this.getAttribute("data-index");
    generateProductEditForm(products[productIndex]); // 調用商品修改頁面並傳入對應商品數據
  });
});

// 取消按鈕事件
document.getElementById("cancelButton").addEventListener("click", function () {
  generateProductManagementContent(); // 返回商品管理頁面
});

// 綁定"商品修改"按鈕的點擊事件
document
  .getElementById("editProductButton")
  .addEventListener("click", function (event) {
    event.preventDefault();
    generateProductManagementWithActionsContent(); // 生成商品管理頁面
  });
