// 全局购物车数据
let cartData = [];
// 元素获取
const categoryItems = document.querySelectorAll('.category-item');
const categoryBlocks = document.querySelectorAll('.category-block');
const addCartBtns = document.querySelectorAll('.add-cart-btn');
const cartBar = document.getElementById('cartBar');
const cartModal = document.getElementById('cartModal');
const cartModalMask = document.getElementById('cartModalMask');
const closeModal = document.getElementById('closeModal');
const cartList = document.getElementById('cartList');
const clearCart = document.getElementById('clearCart');
const cartCount = document.querySelector('.cart-count');
const totalPrice = document.querySelector('.total-price');
const footerTotalPrice = document.querySelector('.footer-total-price');
const submitOrder = document.querySelector('.submit-order');

// 1. 分类切换逻辑
categoryItems.forEach(item => {
  item.addEventListener('click', () => {
    // 分类栏高亮
    categoryItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    // 显示对应分类的商品
    const categoryId = item.getAttribute('data-category');
    categoryBlocks.forEach(block => {
      block.style.display = block.id === categoryId ? 'block' : 'none';
    });
  });
});

// 2. 加入购物车动画
function cartFlyAnimation(e) {
  const img = e.target.closest('.goods-item').querySelector('.goods-img img').cloneNode(true);
  img.style.position = 'fixed';
  img.style.width = '50px';
  img.style.height = '50px';
  img.style.zIndex = '9999';
  img.style.borderRadius = '50%';
  img.style.transition = 'all 0.8s ease';
  // 获取按钮位置
  const rect = e.target.getBoundingClientRect();
  img.style.top = `${rect.top}px`;
  img.style.left = `${rect.left}px`;
  document.body.appendChild(img);
  // 移动到购物车图标位置
  const cartIcon = document.querySelector('.cart-left i');
  const cartRect = cartIcon.getBoundingClientRect();
  setTimeout(() => {
    img.style.top = `${cartRect.top}px`;
    img.style.left = `${cartRect.left}px`;
    img.style.opacity = '0';
  }, 100);
  // 动画结束后移除
  setTimeout(() => {
    img.remove();
  }, 900);
}

// 3. 加入购物车逻辑
addCartBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    // 执行飞入动画
    cartFlyAnimation(e);
    // 获取商品信息
    const goodsItem = e.target.closest('.goods-item');
    const goodsId = goodsItem.getAttribute('data-id');
    const goodsName = goodsItem.getAttribute('data-name');
    const goodsPrice = parseFloat(goodsItem.getAttribute('data-price'));
    const goodsImg = goodsItem.querySelector('.goods-img img').src;

    // 检查商品是否已在购物车
    const existingItem = cartData.find(item => item.id === goodsId);
    if (existingItem) {
      // 已存在，数量+1
      existingItem.count++;
    } else {
      // 不存在，添加新商品
      cartData.push({
        id: goodsId,
        name: goodsName,
        price: goodsPrice,
        count: 1,
        img: goodsImg
      });
    }

    // 更新购物车
    updateCart();
  });
});

// 4. 更新购物车（核心：数量+价格累计）
function updateCart() {
  // 清空购物车列表
  cartList.innerHTML = '';
  // 计算总数量和总价
  let totalCount = 0;
  let totalMoney = 0;

  if (cartData.length === 0) {
    // 购物车为空
    cartList.innerHTML = `
      <div class="cart-empty">
        <i class="fas fa-shopping-bag"></i>
        <p>购物车还是空的，快去挑选商品吧~</p>
      </div>
    `;
  } else {
    // 遍历购物车数据，生成商品项
    cartData.forEach(item => {
      totalCount += item.count;
      totalMoney += item.price * item.count;

      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <div class="cart-item-img">
          <img src="${item.img}" alt="${item.name}">
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">¥${item.price.toFixed(2)}</div>
        </div>
        <div class="cart-item-count">
          <button class="count-btn minus" data-id="${item.id}">-</button>
          <span class="cart-count-num">${item.count}</span>
          <button class="count-btn plus" data-id="${item.id}">+</button>
        </div>
        <div class="cart-item-del" data-id="${item.id}">删除</div>
      `;
      cartList.appendChild(cartItem);
    });

    // 绑定数量操作和删除事件
    bindCartItemEvents();
  }

  // 更新页面显示：数量+总价
  cartCount.innerText = totalCount;
  totalPrice.innerText = `¥${totalMoney.toFixed(2)}`;
  footerTotalPrice.innerText = `¥${totalMoney.toFixed(2)}`;
  // 禁用/启用结算按钮
  submitOrder.disabled = totalCount === 0;
}

// 5. 绑定购物车商品项的事件（减数量、加数量、删除）
function bindCartItemEvents() {
  // 减数量
  const minusBtns = document.querySelectorAll('.count-btn.minus');
  minusBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const goodsId = btn.getAttribute('data-id');
      const item = cartData.find(item => item.id === goodsId);
      if (item.count > 1) {
        item.count--;
      } else {
        // 数量为1，删除商品
        cartData = cartData.filter(item => item.id !== goodsId);
      }
      updateCart();
    });
  });

  // 加数量
  const plusBtns = document.querySelectorAll('.count-btn.plus');
  plusBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const goodsId = btn.getAttribute('data-id');
      const item = cartData.find(item => item.id === goodsId);
      item.count++;
      updateCart();
    });
  });

  // 删除商品
  const delBtns = document.querySelectorAll('.cart-item-del');
  delBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const goodsId = btn.getAttribute('data-id');
      cartData = cartData.filter(item => item.id !== goodsId);
      updateCart();
    });
  });
}

// 6. 购物车弹窗操作
// 打开购物车
cartBar.addEventListener('click', () => {
  cartModal.style.display = 'flex';
  cartModalMask.style.display = 'block';
  // 禁止页面滚动
  document.body.style.overflow = 'hidden';
});

// 关闭购物车
function closeCartModal() {
  cartModal.style.display = 'none';
  cartModalMask.style.display = 'none';
  // 恢复页面滚动
  document.body.style.overflow = 'auto';
}

closeModal.addEventListener('click', closeCartModal);
cartModalMask.addEventListener('click', closeCartModal);

// 清空购物车
clearCart.addEventListener('click', () => {
  if (cartData.length === 0) return;
  if (confirm('确定要清空购物车吗？')) {
    cartData = [];
    updateCart();
  }
});

// 7. 结算按钮点击事件
submitOrder.addEventListener('click', () => {
  const totalMoney = footerTotalPrice.innerText;
  alert(`结算成功！您本次消费${totalMoney}，感谢您的购买~`);
  // 清空购物车
  cartData = [];
  updateCart();
  closeCartModal();
});

// 初始化购物车
updateCart();