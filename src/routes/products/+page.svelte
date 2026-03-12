<script>
    export let data;
    import { cartCount } from '$lib/stores/cartStore.js';
    import { cart } from '$lib/stores/cartStore.js';
    import { search } from "$lib/stores/search";
    import { category } from "$lib/stores/categories";


    function addToCart(product) {
	    cart.addItem(product);
    }

    //reference to this code in document
    $: filteredProducts = data.products
		.filter(p => p.name.toLowerCase().includes($search.toLowerCase()))
		.filter(p => !$category || p.category === $category);
</script>
<svelte:head>
        <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> Shoe Shop</title>

        <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    
        <!-- Link to Bootstrap Stylesheet-->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">

        <!-- Link to My Stylesheet-->
        <link rel="stylesheet" href="/css/style.css">
</svelte:head>

<div class="container">
    {#each filteredProducts as product (product.id)}
        <div class="product-card">
            <div class="product-image">
                <img src={"/productImage/" +product.image} alt={product.name}>
            </div>

            <div class="product-info">
                <h4 class="product-title">{product.name}</h4>
                <p class="product-desc">{product.description}</p>
                <h5 class="product-price">${product.price}</h5>
                <button class="cart" on:click={() => addToCart(product)}>Add To Cart</button>
            </div>
        </div>
    {/each}
</div>