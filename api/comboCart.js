// document.addEventListener('DOMContentLoaded', function() {
//     let cartItems = JSON.parse(getCookie('cartItems') || '[]');
//     const cartItemsContainer = document.getElementById('cart-items');
//     cartItemsContainer.innerHTML = '';
//
//     cartItems.forEach((item, index) => {
//         let total = item.foodPrice * item.quantity;
//         let itemRow = document.createElement('tr');
//         itemRow.innerHTML = `
//                     <td class="product-thumbnail">
//                         <img src="${item.foodImage}" alt="${item.foodName}" class="img-fluid">
//                     </td>
//                     <td class="product-name">
//                         <h2 class="h5 text-black">${item.foodName}</h2>
//                     </td>
//                     <td class="product-price">$${item.foodPrice}</td>
//                     <td>
//                         <div class="input-group mb-3" style="max-width: 120px;">
//                             <div class="input-group-prepend">
//                                 <button class="btn btn-outline-primary js-btn-minus" type="button" data-index="${index}">&minus;</button>
//                             </div>
//                             <input type="text" class="form-control text-center" value="${item.quantity}" aria-label="Quantity" data-index="${index}" readonly>
//                             <div class="input-group-append">
//                                 <button class="btn btn-outline-primary js-btn-plus" type="button" data-index="${index}">&plus;</button>
//                             </div>
//                         </div>
//                     </td>
//                     <td class="product-total">$${total}</td>
//                     <td><button class="btn btn-primary btn-sm js-btn-remove" data-index="${index}">X</button></td>
//                 `;
//         cartItemsContainer.appendChild(itemRow);
//     });
//
//     document.querySelectorAll('.js-btn-minus').forEach(button => {
//         button.addEventListener('click', function() {
//             const index = parseInt(this.getAttribute('data-index'));
//             if (cartItems[index].quantity > 1) {
//                 cartItems[index].quantity--;
//                 updateCart();
//             }
//         });
//     });
//
//     document.querySelectorAll('.js-btn-plus').forEach(button => {
//         button.addEventListener('click', function() {
//             const index = parseInt(this.getAttribute('data-index'));
//             cartItems[index].quantity++;
//             updateCart();
//         });
//     });
//
//     document.querySelectorAll('.js-btn-remove').forEach(button => {
//         button.addEventListener('click', function() {
//             const index = parseInt(this.getAttribute('data-index'));
//             cartItems.splice(index, 1);
//             updateCart();
//         });
//     });
//
//     function updateCart() {
//         setCookie('cartItems', JSON.stringify(cartItems), 7);
//         // Update the DOM to reflect changes
//         let total = 0;
//         cartItemsContainer.innerHTML = '';
//         cartItems.forEach((item, index) => {
//             let subtotal = item.foodPrice * item.quantity;
//             total += subtotal;
//             let itemRow = document.createElement('tr');
//             itemRow.innerHTML = `
//                         <td class="product-thumbnail">
//                             <img src="${item.foodImage}" alt="${item.foodName}" class="img-fluid">
//                         </td>
//                         <td class="product-name">
//                             <h2 class="h5 text-black">${item.foodName}</h2>
//                         </td>
//                         <td class="product-price">$${item.foodPrice}</td>
//                         <td>
//                             <div class="input-group mb-3" style="max-width: 120px;">
//                                 <div class="input-group-prepend">
//                                     <button class="btn btn-outline-primary js-btn-minus" type="button" data-index="${index}">&minus;</button>
//                                 </div>
//                                 <input type="text" class="form-control text-center" value="${item.quantity}" aria-label="Quantity" data-index="${index}" readonly>
//                                 <div class="input-group-append">
//                                     <button class="btn btn-outline-primary js-btn-plus" type="button" data-index="${index}">&plus;</button>
//                                 </div>
//                             </div>
//                         </td>
//                         <td class="product-total">$${subtotal}</td>
//                         <td><button class="btn btn-primary btn-sm js-btn-remove" data-index="${index}">X</button></td>
//                     `;
//             cartItemsContainer.appendChild(itemRow);
//         });
//
//         // Update total
//         document.getElementById('cart-total').innerText = `$${total}`;
//     }
// });
//
// // Utility functions to handle cookies
// function setCookie(name, value, days) {
//     const d = new Date();
//     d.setTime(d.getTime() + (days*24*60*60*1000));
//     const expires = "expires=" + d.toUTCString();
//     document.cookie = name + "=" + value + ";" + expires + ";path=/";
// }
//
// function getCookie(name) {
//     const cname = name + "=";
//     const decodedCookie = decodeURIComponent(document.cookie);
//     const ca = decodedCookie.split(';');
//     for(let i = 0; i < ca.length; i++) {
//         let c = ca[i];
//         while (c.charAt(0) === ' ') {
//             c = c.substring(1);
//         }
//         if (c.indexOf(cname) === 0) {
//             return c.substring(cname.length, c.length);
//         }
//     }
//     return "";
// }