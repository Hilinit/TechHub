let CatData = []

let Base_data = 'https://69c53df08a5b6e2dec2c09e9.mockapi.io/hub_products'
let cat_data = 'https://69c53df08a5b6e2dec2c09e9.mockapi.io/hub_categories'
let categories = document.getElementById('categories-part')

async function getCat() {
    const res = await fetch(cat_data)
    CatData = await res.json()
    renderCat()
}
function renderCat(){
    categories.innerHTML = CatData.map(item => `
        <div 
  onclick="filtrData('${item.name}')" 
  class="bg-white/5 border border-white/10 rounded-xl p-2 text-center cursor-pointer text-white transition-all duration-300 hover:border-green-500 hover:shadow-[0_0_80px_rgba(34,197,94,0.3)] hover:bg-green-500/10">
        ${item.name}
      </div>`).join('')
    } 
getCat()

// ---------------------------------------Products-------------------------------------
let products = document.getElementById('products-part')
let BaseData = []

async function getProducts() {
    const res = await fetch(Base_data)
    BaseData = await res.json()
    renderProducts()
}
function renderProducts(data = BaseData) {
    products.innerHTML = data.map(item => `
        <div class=" rounded-2xl overflow-hidden cursor-pointer flex flex-col border border-green-700 transition-all duration-300  hover:shadow-[0_0_80px_rgba(34,197,94,0.3)] hover:bg-green-500/10">
        <div class="relative prod-img-wrap h-52">
          <img src="${item.image}" alt="Wooting 60HE" class="w-full h-full " />
          ${item.discount > 0 ? `
            <span class="badge-discount absolute top-3 right-3 text-white text-xs font-orbitron font-bold px-2.5 py-1 rounded-full"  style="background: linear-gradient(135deg,#22c55e,#368157);"> -${item.discount}%</span>` : ""}
          <div class="absolute top-3 left-3 text-xs px-2 py-0.5 rounded-full" style="background:rgba(5,8,16,0.7); color:rgba(255,255,255,0.5); border:1px solid rgba(255,255,255,0.1);">${item.category}</div>
        </div>
        <div class="p-5 flex flex-col flex-1">
          <div class="flex items-center gap-1.5 mb-1">
          <span class="w-1.5 h-1.5 rounded-full ${item.count < 8 ? 'bg-red-500' : 'bg-[#22c55e]'}"></span>
            <span class="${item.count < 8 ? 'text-red-500' : 'text-[#22c55e]'} text-xs">${item.count} in stock
          </span>
          </div>
          <h3 class="font-orbitron font-bold text-sm text-white mb-3 leading-snug">${item.title}</h3>
          <div class="flex items-baseline gap-2 mt-auto mb-4">
            <span class="text-lg font-bold" style="color:#22c55e">${(item.price - (item.price * item.discount)/100)}$</span>
            ${item.discount > 0 ? ` <span class="text-xs line-through text-white/30"> ${item.price}$ </span>`: ""}
          </div>
          <button onclick="addToBasket('${item.title}', ${item.price}, ${item.discount}, '${item.image}')" class="btn-cart w-full py-2.5 rounded-xl text-sm font-semibold text-center border border-green-700 text-white">Add to  Basket</button>
        </div>
      </div>`).join('')
    }  

getProducts()

// -----------------------------Modal-Sebet----------------------------------
const modal = document.getElementById("modal")
function openClose() { modal.style.display === 'none' ? modal.style.display = 'block' : modal.style.display = 'none' }

let basket = []
let promoApplied = false

function addToBasket(name, price, discount, image) {
    const existing = basket.find(n => n.name === name)
    if (existing) {
        existing.count += 1
    } else {
        basket.push({ name, price, discount, count: 1, image })
    }
    updateUI()
}
function increaseCount(index) {
    basket[index].count += 1
    updateUI()
}
function decreaseCount(index) {
    if (basket[index].count > 1) {
        basket[index].count -= 1
    } else {
        basket.splice(index, 1)
    }
    updateUI()
}
function removeFromBasket(index) {
    basket.splice(index, 1)
    updateUI()
}
function applyPromo() {
    const input = document.getElementById('promo-input').value.trim()
    const msg = document.getElementById('promo-msg')
    const vali = Number(input)

    if (!input || vali <= 0 || vali > 100) {
        promoApplied = false
        msg.innerText = 'X 1-100 arası rəqəm daxil et'
        msg.className = 'text-xs mt-2 text-red-500 font-medium'
    } else {
        promoApplied = vali
        msg.innerText = `✓ ${vali}% endirim tətbiq edildi!`
        msg.className = 'text-xs mt-2 text-emerald-600 font-medium'
    }
    calculateTotal()
}

function updateUI() {
    const sebet = document.getElementById('sebet')
    const countBadge = document.getElementById('proCount')

    sebet.innerHTML = ''
    countBadge.innerText = basket.reduce((acc, item) => acc + item.count, 0)
    countBadge.style.display = basket.length === 0 ? 'none' : 'flex'

    if (basket.length === 0) {
        sebet.innerHTML = '<p class="text-white italic py-4">Səbətiniz hal-hazırda boşdur.</p>'
        calculateTotal()
        return
    }
    basket.forEach((item, index) => {
        let singleDiscountedPrice = item.price - (item.price * item.discount) / 100;
        let totalItemPrice = singleDiscountedPrice * item.count;

        sebet.innerHTML += `<li class="bg-[#050810] border border-green-700 rounded-2xl p-5 shadow-sm"> 
            <div class="flex items-center gap-4">
                <img src="${item.image}" class="w-[20%] h-40 object-cover rounded-lg shrink-0" />
                <div class="flex-1">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="font-medium text-white">${item.name}</p>   
                        </div>
                        <div class="flex flex-col items-end gap-2">
                        <div class="flex items-baseline gap-2 mt-auto mb-4">
                            <span class="text-lg font-bold" style="color:#22c55e">Total: ${(item.price - (item.price * item.discount)/100)*item.count}$</span>${item.discount > 0 ? ` <span class="text-xs line-through text-white/30"> ${item.price*item.count}$ </span>`: ""}
                        </div>
                            <button onclick="removeFromBasket(${index})" class="text-gray-300 hover:text-red-500 transition cursor-pointer">
                                <i class="fa-regular fa-trash-can text-[15px]"></i>
                            </button>
                        </div>
                    </div>
                    <div class="flex items-baseline gap-2 mt-auto mb-4">
                             <span class="text-lg font-bold" style="color:#22c55e">${(item.price - (item.price * item.discount)/100)}$</span>${item.discount > 0 ? ` <span class="text-xs line-through text-white/30"> ${item.price}$ </span>`: ""}
                    </div>
                    
                    <div class="flex items-center border border-slate-700 rounded-lg overflow-hidden w-max mt-3 text-white">
                        <button onclick="decreaseCount(${index})" class="px-3 py-1.5 hover:bg-white/10 transition cursor-pointer text-sm">-</button>
                        <span class="px-4 text-sm font-semibold">${item.count}</span>
                        <button onclick="increaseCount(${index})" class="px-3 py-1.5 hover:bg-white/10 transition cursor-pointer text-sm">+</button>
                    </div>
                </div>
            </div>
        </li>`
    })

    calculateTotal()
}

function calculateTotal() {
    let totalRaw = 0
    let totalProductDiscount = 0

    basket.forEach(item => {
        totalRaw += item.price * item.count
        totalProductDiscount += ((item.price * item.discount) / 100) * item.count
    })
    
    const afterProductDiscount = totalRaw - totalProductDiscount
    const promoPercent = promoApplied || 0
    const promoAmount = (afterProductDiscount * promoPercent) / 100
    const finalAmount = afterProductDiscount - promoAmount
    const totalDiscountSum = totalProductDiscount + promoAmount

    document.getElementById('subtotal').innerText = `${totalRaw.toFixed(2)} $`
    document.getElementById('discount').innerText = `${totalDiscountSum.toFixed(2)} $`
    document.getElementById('total').innerText = `${finalAmount.toFixed(2)} $` 
}
updateUI()

//--------------------------------------------------------------------------------------
function filtrData(name) {
    const filtered = name === "Hamısı" ? BaseData : BaseData.filter(f => f.category.toLowerCase() === name.toLowerCase() )
    renderProducts(filtered)
}