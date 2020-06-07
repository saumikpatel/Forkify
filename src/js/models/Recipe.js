import  axios from 'axios';

export default class Recipe{
    constructor(id){
        this.id=id;
    }

    async getRecipe(){
        try{
            const res=await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`)
            // console.log(res);
             this.title=res.data.recipe.title;
             this.author=res.data.recipe.publisher;
             this.img=res.data.recipe.image_url;
             this.url=res.data.recipe.source_url;
             this.ingredients=res.data.recipe.ingredients;
            // this.author=res.data.recipe.publisher;


            
        }catch(error){
            alert('something went wrong!!');
           // console.log(error);
        }

    }

    calcTime(){
      
        this.time=90;
    }

    calcServings(){
        this.servings=4;
    }

    parseIngredients(){
        const unitsLong =['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds'];
        const unitShort =['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];
        const newIngredients = this.ingredients.map(el => {

            //uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit,i)=>{
                ingredient=ingredient.replace(unit,unitShort[i]);

            });



            //remove brackets 
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');


            //count units and ingredients
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => unitShort.includes(el2));

            let objIng;
            if(unitIndex>-1){
                const arrCount =arrIng.slice(0, unitIndex); 
                let count;
                if(arrCount.length==1){
                    count=eval(arrIng[0].replace('-','+'));
                }
                else{
                    count=eval(arrIng.slice(0,unitIndex).join('+'));
                }
                objIng ={
                    count,
                    unit:arrIng[unitIndex],
                    ingredient:arrIng.slice(unitIndex+1).join(' ')
                }
                   

            }else if(parseInt(arrIng[0],10)){
                objIng={
                    count:parseInt(arrIng[0],10),
                    unit:'',
                    ingredient:arrIng.slice(1).join(' ')
                }
                
                
            }else if(unitIndex=== -1){
                objIng={
                    count:1,
                    unit: '',
                    ingredient
                }

            }
            return objIng;

        });
        this.ingredients=newIngredients;
        
    }

    updateServings(type){

        const newServing=type === 'dec'?this.servings-1:this.servings+1;

        

        this.ingredients.forEach(ing =>{
            ing.count=ing.count*(newServing/this.servings)

        });
        this.servings=newServing;
    }
}


