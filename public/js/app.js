// DOM要素のキャッシュ
const elements = {
  itemsList: document.getElementById('items-list'),
  addItemForm: document.getElementById('add-item-form'),
  editItemForm: document.getElementById('edit-item-form'),
  editFormCard: document.getElementById('edit-form-card'),
  cancelEditBtn: document.getElementById('cancel-edit'),
  categorySelect: document.getElementById('category'),
  editCategorySelect: document.getElementById('edit-category'),
  searchInput: document.getElementById('search-input'),
  searchButton: document.getElementById('search-button'),
  deleteConfirmModal: new bootstrap.Modal(document.getElementById('delete-confirm-modal')),
  deleteItemName: document.getElementById('delete-item-name'),
  deleteItemId: document.getElementById('delete-item-id'),
  confirmDeleteBtn: document.getElementById('confirm-delete'),
  itemDetailsModal: new bootstrap.Modal(document.getElementById('item-details-modal')),
  itemDetailsContent: document.getElementById('item-details-content')
};

// グローバル変数
let items = [];
let categories = [];
let filteredItems = [];

// APIエンドポイント
const API_URL = {
  ITEMS: '/api/items',
  CATEGORIES: '/api/categories'
};

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // カテゴリを読み込む
    await loadCategories();
    
    // 物品データを読み込む
    await loadItems();
    
    // イベントリスナーを設定
    setupEventListeners();
    
    console.log('アプリケーションが初期化されました');
  } catch (error) {
    console.error('初期化エラー:', error);
    showError('アプリケーションの初期化中にエラーが発生しました');
  }
});

// カテゴリデータの読み込み
async function loadCategories() {
  try {
    const response = await fetch(API_URL.CATEGORIES);
    if (!response.ok) throw new Error('カテゴリ取得に失敗しました');
    
    categories = await response.json();
    updateCategorySelects();
  } catch (error) {
    console.error('カテゴリ読み込みエラー:', error);
    showError('カテゴリ情報の取得に失敗しました');
  }
}

// カテゴリセレクトボックスの更新
function updateCategorySelects() {
  // 追加フォームのカテゴリセレクト
  elements.categorySelect.innerHTML = '<option value="" selected disabled>カテゴリを選択</option>';
  
  // 編集フォームのカテゴリセレクト
  elements.editCategorySelect.innerHTML = '';
  
  categories.forEach(category => {
    // 追加フォーム用オプション
    const addOption = document.createElement('option');
    addOption.value = category.name;
    addOption.textContent = category.name;
    elements.categorySelect.appendChild(addOption);
    
    // 編集フォーム用オプション
    const editOption = document.createElement('option');
    editOption.value = category.name;
    editOption.textContent = category.name;
    elements.editCategorySelect.appendChild(editOption);
  });
}

// 物品データの読み込み
async function loadItems() {
  try {
    const response = await fetch(API_URL.ITEMS);
    if (!response.ok) throw new Error('物品データ取得に失敗しました');
    
    items = await response.json();
    filteredItems = [...items]; // 検索用に全アイテムのコピーを保持
    renderItems();
  } catch (error) {
    console.error('物品データ読み込みエラー:', error);
    showError('物品データの取得に失敗しました');
  }
}

// 物品一覧のレンダリング
function renderItems(itemsToRender = filteredItems) {
  elements.itemsList.innerHTML = '';
  
  if (itemsToRender.length === 0) {
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = '<td colspan="7" class="text-center py-3">物品データがありません</td>';
    elements.itemsList.appendChild(emptyRow);
    return;
  }
  
  itemsToRender.forEach(item => {
    const row = document.createElement('tr');
    row.classList.add('fade-in');
    
    // 数量に応じたクラスを設定
    let quantityClass = '';
    if (item.quantity <= 5) {
      quantityClass = 'quantity-low';
    } else if (item.quantity <= 20) {
      quantityClass = 'quantity-medium';
    } else {
      quantityClass = 'quantity-high';
    }
    
    // 単価のフォーマット
    const formattedPrice = item.unit_price 
      ? new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(item.unit_price)
      : '-';
    
    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.category || '-'}</td>
      <td class="${quantityClass}">${item.quantity}</td>
      <td>${formattedPrice}</td>
      <td>${item.location || '-'}</td>
      <td>
        <div class="btn-group btn-group-sm">
          <button class="btn btn-info btn-action view-btn" data-id="${item.id}">
            <i class="bi bi-eye"></i>
          </button>
          <button class="btn btn-warning btn-action edit-btn" data-id="${item.id}">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-danger btn-action delete-btn" data-id="${item.id}">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </td>
    `;
    
    elements.itemsList.appendChild(row);
  });
  
  // ビューボタンのイベントリスナー
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => viewItem(parseInt(btn.dataset.id)));
  });
  
  // 編集ボタンのイベントリスナー
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => editItem(parseInt(btn.dataset.id)));
  });
  
  // 削除ボタンのイベントリスナー
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => openDeleteConfirm(parseInt(btn.dataset.id)));
  });
}

// イベントリスナーの設定
function setupEventListeners() {
  // 物品追加フォームの送信イベント
  elements.addItemForm.addEventListener('submit', handleAddItem);
  
  // 物品編集フォームの送信イベント
  elements.editItemForm.addEventListener('submit', handleUpdateItem);
  
  // 編集キャンセルボタンのイベント
  elements.cancelEditBtn.addEventListener('click', cancelEdit);
  
  // 検索ボタンのイベント
  elements.searchButton.addEventListener('click', handleSearch);
  
  // 検索入力フィールドのEnterキーイベント
  elements.searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });
  
  // 削除確認ボタンのイベント
  elements.confirmDeleteBtn.addEventListener('click', handleDeleteItem);
}

// 物品追加処理
async function handleAddItem(e) {
  e.preventDefault();
  
  const itemData = {
    name: document.getElementById('name').value,
    description: document.getElementById('description').value,
    category: document.getElementById('category').value,
    quantity: parseInt(document.getElementById('quantity').value),
    unit_price: document.getElementById('unit_price').value 
      ? parseFloat(document.getElementById('unit_price').value) 
      : null,
    location: document.getElementById('location').value
  };
  
  try {
    const response = await fetch(API_URL.ITEMS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData)
    });
    
    if (!response.ok) throw new Error('物品追加に失敗しました');
    
    const newItem = await response.json();
    
    // 成功メッセージ表示
    showSuccess(`「${newItem.name}」を追加しました！`);
    
    // フォームリセット
    elements.addItemForm.reset();
    
    // 物品一覧を再読み込み
    await loadItems();
  } catch (error) {
    console.error('物品追加エラー:', error);
    showError('物品の追加に失敗しました');
  }
}

// 編集フォームを表示する
function editItem(id) {
  const item = items.find(item => item.id === id);
  if (!item) {
    showError('物品データが見つかりません');
    return;
  }
  
  // 編集フォームにデータをセット
  document.getElementById('edit-id').value = item.id;
  document.getElementById('edit-name').value = item.name;
  document.getElementById('edit-description').value = item.description || '';
  document.getElementById('edit-quantity').value = item.quantity;
  document.getElementById('edit-unit_price').value = item.unit_price || '';
  document.getElementById('edit-location').value = item.location || '';
  
  // カテゴリの選択
  const categorySelect = document.getElementById('edit-category');
  for (let i = 0; i < categorySelect.options.length; i++) {
    if (categorySelect.options[i].value === item.category) {
      categorySelect.selectedIndex = i;
      break;
    }
  }
  
  // 編集フォームを表示
  elements.editFormCard.classList.remove('d-none');
  
  // スムーズなスクロール
  elements.editFormCard.scrollIntoView({ behavior: 'smooth' });
}

// 編集キャンセル
function cancelEdit() {
  elements.editFormCard.classList.add('d-none');
  elements.editItemForm.reset();
}

// 物品更新処理
async function handleUpdateItem(e) {
  e.preventDefault();
  
  const id = document.getElementById('edit-id').value;
  const itemData = {
    name: document.getElementById('edit-name').value,
    description: document.getElementById('edit-description').value,
    category: document.getElementById('edit-category').value,
    quantity: parseInt(document.getElementById('edit-quantity').value),
    unit_price: document.getElementById('edit-unit_price').value 
      ? parseFloat(document.getElementById('edit-unit_price').value) 
      : null,
    location: document.getElementById('edit-location').value
  };
  
  try {
    const response = await fetch(`${API_URL.ITEMS}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData)
    });
    
    if (!response.ok) throw new Error('物品更新に失敗しました');
    
    // 成功メッセージ表示
    showSuccess(`「${itemData.name}」を更新しました！`);
    
    // 編集フォームを非表示にする
    cancelEdit();
    
    // 物品一覧を再読み込み
    await loadItems();
  } catch (error) {
    console.error('物品更新エラー:', error);
    showError('物品の更新に失敗しました');
  }
}

// 削除確認モーダルを開く
function openDeleteConfirm(id) {
  const item = items.find(item => item.id === id);
  if (!item) {
    showError('物品データが見つかりません');
    return;
  }
  
  elements.deleteItemName.textContent = `${item.name}（ID: ${item.id}）`;
  elements.deleteItemId.value = item.id;
  elements.deleteConfirmModal.show();
}

// 物品削除処理
async function handleDeleteItem() {
  const id = elements.deleteItemId.value;
  
  try {
    const response = await fetch(`${API_URL.ITEMS}/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error('物品削除に失敗しました');
    
    // モーダルを閉じる
    elements.deleteConfirmModal.hide();
    
    // 成功メッセージ表示
    showSuccess('物品を削除しました！');
    
    // 物品一覧を再読み込み
    await loadItems();
  } catch (error) {
    console.error('物品削除エラー:', error);
    showError('物品の削除に失敗しました');
    elements.deleteConfirmModal.hide();
  }
}

// 詳細表示
function viewItem(id) {
  const item = items.find(item => item.id === id);
  if (!item) {
    showError('物品データが見つかりません');
    return;
  }
  
  // 詳細情報のHTML生成
  const formattedPrice = item.unit_price 
    ? new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(item.unit_price)
    : '-';
  
  const formattedTotal = item.unit_price 
    ? new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(item.unit_price * item.quantity)
    : '-';
  
  const createdDate = new Date(item.created_at).toLocaleString('ja-JP');
  const updatedDate = new Date(item.updated_at).toLocaleString('ja-JP');
  
  elements.itemDetailsContent.innerHTML = `
    <div class="card border-0">
      <div class="card-body p-0">
        <h4 class="mb-3">${item.name}</h4>
        
        <table class="table table-borderless">
          <tbody>
            <tr>
              <th width="30%">ID</th>
              <td>${item.id}</td>
            </tr>
            <tr>
              <th>説明</th>
              <td>${item.description || '-'}</td>
            </tr>
            <tr>
              <th>カテゴリ</th>
              <td>${item.category || '-'}</td>
            </tr>
            <tr>
              <th>数量</th>
              <td>${item.quantity}</td>
            </tr>
            <tr>
              <th>単価</th>
              <td>${formattedPrice}</td>
            </tr>
            <tr>
              <th>合計金額</th>
              <td>${formattedTotal}</td>
            </tr>
            <tr>
              <th>保管場所</th>
              <td>${item.location || '-'}</td>
            </tr>
            <tr>
              <th>登録日時</th>
              <td>${createdDate}</td>
            </tr>
            <tr>
              <th>最終更新</th>
              <td>${updatedDate}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
  
  elements.itemDetailsModal.show();
}

// 検索処理
function handleSearch() {
  const searchTerm = elements.searchInput.value.trim().toLowerCase();
  
  if (!searchTerm) {
    // 検索語が空の場合、全件表示
    filteredItems = [...items];
  } else {
    // 検索条件に一致するアイテムをフィルタリング
    filteredItems = items.filter(item => {
      return (
        (item.name && item.name.toLowerCase().includes(searchTerm)) ||
        (item.description && item.description.toLowerCase().includes(searchTerm)) ||
        (item.category && item.category.toLowerCase().includes(searchTerm)) ||
        (item.location && item.location.toLowerCase().includes(searchTerm))
      );
    });
  }
  
  // 結果を表示
  renderItems(filteredItems);
  
  // 検索結果のメッセージ
  if (searchTerm && filteredItems.length === 0) {
    showInfo(`「${searchTerm}」に一致する物品は見つかりませんでした`);
  } else if (searchTerm) {
    showSuccess(`「${searchTerm}」で検索: ${filteredItems.length}件の物品が見つかりました`);
  }
}

// 成功メッセージ表示
function showSuccess(message) {
  showToast(message, 'success');
}

// 情報メッセージ表示
function showInfo(message) {
  showToast(message, 'info');
}

// エラーメッセージ表示
function showError(message) {
  showToast(message, 'danger');
}

// トースト通知の表示
function showToast(message, type = 'info') {
  // すでに存在するトーストコンテナを検索
  let toastContainer = document.querySelector('.toast-container');
  
  // なければ作成
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    document.body.appendChild(toastContainer);
  }
  
  // 色に応じたクラス
  const bgClass = type === 'success' ? 'bg-success' :
                type === 'danger' ? 'bg-danger' :
                type === 'warning' ? 'bg-warning' : 'bg-info';
  
  // トースト要素の作成
  const toastEl = document.createElement('div');
  toastEl.className = `toast align-items-center text-white ${bgClass} border-0`;
  toastEl.setAttribute('role', 'alert');
  toastEl.setAttribute('aria-live', 'assertive');
  toastEl.setAttribute('aria-atomic', 'true');
  
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;
  
  // トーストコンテナに追加
  toastContainer.appendChild(toastEl);
  
  // Bootstrapトーストの初期化と表示
  const toast = new bootstrap.Toast(toastEl, {
    animation: true,
    autohide: true,
    delay: 3000
  });
  
  toast.show();
  
  // 自動削除（アニメーション完了後）
  toastEl.addEventListener('hidden.bs.toast', () => {
    toastEl.remove();
  });
}
