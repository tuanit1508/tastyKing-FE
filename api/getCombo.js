document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:8080/TastyKing/combo')
        .then(response => response.json())
        .then(data => {
            if (data.code === 0) {
                const combos = data.result;
                const comboContainer = document.getElementById('combo-container');

                combos.forEach(combo => {
                    const comboElement = createComboElement(combo);
                    comboContainer.appendChild(comboElement);
                });
            } else {
                console.error('Failed to fetch combos:', data.message);
            }
        })
        .catch(error => {
            console.error('Error fetching combos:', error);
        });
});

function createComboElement(combo) {
    const colDiv = document.createElement('div');
    colDiv.classList.add('col-sm-6', 'col-md-6', 'col-lg-4', 'col-xl-4');

    const productSingleDiv = document.createElement('div');
    productSingleDiv.classList.add('products-single', 'fix');

    const boxImgHoverDiv = document.createElement('div');
    boxImgHoverDiv.classList.add('box-img-hover');

    const typeLbDiv = document.createElement('div');
    typeLbDiv.classList.add('type-lb');

    const newP = document.createElement('p');
    newP.classList.add('new');
    newP.innerText = 'New';

    typeLbDiv.appendChild(newP);
    boxImgHoverDiv.appendChild(typeLbDiv);

    const img = document.createElement('img');
    img.src = combo.comboImage;
    img.classList.add('img-fluid');
    img.alt = combo.comboTitle;

    boxImgHoverDiv.appendChild(img);

    const maskIconDiv = document.createElement('div');
    maskIconDiv.classList.add('mask-icon');

    const ul = document.createElement('ul');

    const viewLi = document.createElement('li');
    const viewA = document.createElement('a');
    viewA.href = '#';
    viewA.setAttribute('data-toggle', 'tooltip');
    viewA.setAttribute('data-placement', 'right');
    viewA.setAttribute('title', 'View');
    viewA.innerHTML = '<i class="fas fa-eye"></i>';
    viewA.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = `ComboDetail.html?comboId=${combo.comboID}`;
    });
    viewLi.appendChild(viewA);
    ul.appendChild(viewLi);

    const wishlistLi = document.createElement('li');
    const wishlistA = document.createElement('a');
    wishlistA.href = '#';
    wishlistA.setAttribute('data-toggle', 'tooltip');
    wishlistA.setAttribute('data-placement', 'right');
    wishlistA.setAttribute('title', 'Add to Wishlist');
    wishlistA.innerHTML = '<i class="far fa-heart"></i>';
    wishlistLi.appendChild(wishlistA);
    ul.appendChild(wishlistLi);

    maskIconDiv.appendChild(ul);
    boxImgHoverDiv.appendChild(maskIconDiv);

    productSingleDiv.appendChild(boxImgHoverDiv);
    colDiv.appendChild(productSingleDiv);

    const textColDiv = document.createElement('div');
    textColDiv.classList.add('col-sm-6', 'col-md-6', 'col-lg-8', 'col-xl-8');

    const whyTextDiv = document.createElement('div');
    whyTextDiv.classList.add('why-text', 'full-width');

    const h4 = document.createElement('h4');
    h4.innerText = combo.comboTitle;

    const h5 = document.createElement('h5');
    h5.innerHTML = `<del>$${combo.oldPrice}</del> $${combo.newPrice}`;

    const p = document.createElement('p');
    p.innerText = combo.comboDescription;

    const addButton = document.createElement('a');
    addButton.classList.add('btn', 'hvr-hover');
    addButton.href = '#';
    addButton.innerText = 'Add to Cart';

    whyTextDiv.appendChild(h4);
    whyTextDiv.appendChild(h5);
    whyTextDiv.appendChild(p);
    whyTextDiv.appendChild(addButton);

    textColDiv.appendChild(whyTextDiv);

    const rowDiv = document.createElement('div');
    rowDiv.classList.add('row');

    rowDiv.appendChild(colDiv);
    rowDiv.appendChild(textColDiv);

    return rowDiv;
}
