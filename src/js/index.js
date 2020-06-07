// In the Search.js file (as soon as you get there), just replace:

// const res = await axios(`${PROXY}http://food2fork.com/api/search?key=${KEY}&q=${this.query}`);
// with this:

// const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);


// Then, in Recipe.js (as soon as you get there), please replace:

// const res = await axios(`${PROXY}http://food2fork.com/api/get?key=${KEY}&rId=${this.id}`);
// with this:

// const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);


import Search from './models/Search'
import {elements, renderLoader, clearLoader} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';


// global state of the object
//     search object
//     current recipe object
//     shopping list
//     liked recipe
const state ={};

const controlSearch=async()=>{
    //get the query from the view
    const query= searchView.getInput();
    //console.log(query);
    if(query){
        // new search object and add it to state
        state.search=new Search(query);
        //prepare UI for results
        searchView.clearResults();

        searchView.clearInput();
        renderLoader(elements.searchRes);

        // search for recipe
        await state.search.getResults();

        //render results on UI
        clearLoader();
       // console.log(state.search.result);
        searchView.renderResults(state.search.result);
    }

}
elements.searchForm.addEventListener('submit',e=>{
    e.preventDefault();
    controlSearch();

});

elements.searchResPages.addEventListener('click',e=>{
    
    const btn =e.target.closest('.btn-inline');
    if(btn)
    {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result,goToPage);
    }
});



// recipe controller

// const r = new recipe(47746);
// r.getRecipe();
// console.log(r);

const controlRecipe =async()=>{
    const id=location.hash.replace('#','');
   // console.log(id);

    if(id){
     //   console.log('i am here');
        //prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        searchView.highlightSelected(id);

        //create new recipe object
        if(state.search){
        state.recipe= new Recipe(id);
        }
        //get data from the server
        try{
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //calculate serving and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //render recipe
            //console.log(state.recipe);
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
            
        }catch(error){
            alert('Error processing recipes.');
        }

    }
}

const controlList=()=>{
    //create a new list if there is not yet
   // console.log('i am here in ctrl');
    if(!state.list){
        state.list=new List();
    }
    //add each ingredient in list
    state.recipe.ingredients.forEach(el =>{
       const item= state.list.addItem(el.count, el.unit, el.ingredient);
       listView.renderItem(item);
    });
   




}

const controlLike=()=>{
   // console.log('in like');
    if(!state.likes){
        state.likes=new Likes();
    }
    const currentID=state.recipe.id;
    if(!state.likes.isLiked(currentID)){
       // console.log('in if')
        const newLike=state.likes.addLike(currentID, state.recipe.title,state.recipe.author, state.recipe.img);
       // console.log(state.likes);
        likesView.toggleLikeBtn(true);
        likesView.renderLike(newLike);

    }else{
       // console.log('in false');
        
        state.likes.deleteLike(currentID);
        likesView.toggleLikeBtn(false);
      //  console.log(state.likes);
        likesView.deleteLike(currentID);

    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}



elements.shopping.addEventListener('click',e =>{
    const id = e.target.closest('.shopping__item').dataset.itemid;
    //console.log(id);

    if(e.target.matches('.shopping__delete ,.shopping__delete *')){
       // console.log('lets delete');
        //delete from state
        state.list.deleteItem(id);


        //delete from ui
        listView.deleteItem(id);
    }else if(e.target.matches('.shopping__count--value')){
        const val=parseFloat(e.target.value);
        state.list.updateCount(id,val);
    }


});

window.addEventListener('hashchange',controlRecipe);
//['haschange','load'].forEach(event => window.addEventListener(event,controlRecipe));



window.addEventListener('load',()=>{
    state.likes=new Likes();

    state.likes.readStorage();

    likesView.toggleLikeMenu(state.likes.getNumLikes());

    state.likes.likes.forEach(like => likesView.renderLike(like));
})
elements.recipe.addEventListener('click',e=>{
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
       // console.log('i am in if');
        if(state.recipe.servings >1){
        state.recipe.updateServings('dec');
        recipeView.updateServingsIngredients(state.recipe);
        }

    }else if(e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);

    }
    else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList();

    }else if(e.target.matches('.recipe__Love, .recipe__love *')){
        controlLike();
    }
});


window.l=new List();


// const search = new Search('pizza');
// console.log(search);
// search.getResults();

