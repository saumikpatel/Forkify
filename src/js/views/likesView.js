import {elements} from './base';

export const toggleLikeBtn = isLiked =>{
    const iconString =isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute(`href`,` img/icons.svg#${iconString}`);
};

export const toggleLikeMenu = numLikes=>{
    //console.log(numLikes);
   elements.likesMenu.style.visibility=numLikes>0? 'visible':'hidden';
}

export const renderLike = likes =>{
    const markup= `
    <li>
        <a class="likes__link" href="#${likes.id}">
            <figure class="likes__fig">
                <img src="${likes.image}" alt="${likes.title}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${likes.title}</h4>
                <p class="likes__author">${likes.author}</p>
            </div>
        </a>
    </li>
    
    
    
    
    
    
    
    `;
    elements.likesList.insertAdjacentHTML('beforeend',markup);
};
export const deleteLike = id=>{
    const el =document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
    if(el){
        el.parentElement.removeChild(el);
    }
}


