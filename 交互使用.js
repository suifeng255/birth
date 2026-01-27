// 分类切换逻辑（点击分类显示对应商品）
const categoryItems = document.querySelectorAll('.category-item');
const categoryBlocks = document.querySelectorAll('.category-block');

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

// 加入购物车动画（原有逻辑保持不变）
const addCartBtns = document.querySelectorAll('.add-cart-btn');
addCartBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const img = e.target.closest('.goods-item').querySelector('.goods-img img').cloneNode(true);
    img.style.position = 'fixed';
    img.style.width = '50px';
    img.style.height = '50px';
    img.style.zIndex = '9999';
    img.style.borderRadius = '50%';
    img.style.transition = 'all 0.8s ease';
    
    const rect = e.target.getBoundingClientRect();
    img.style.top = `${rect.top}px`;
    img.style.left = `${rect.left}px`;
    document.body.appendChild(img);
    
    const cartIcon = document.querySelector('.cart-left i');
    const cartRect = cartIcon.getBoundingClientRect();
    setTimeout(() => {
      img.style.top = `${cartRect.top}px`;
      img.style.left = `${cartRect.left}px`;
      img.style.opacity = '0';
    }, 100);
    
    setTimeout(() => {
      img.remove();
    }, 900);
  });
});