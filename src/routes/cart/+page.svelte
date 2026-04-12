<script>

import { cart, cartCount } from "$lib/stores/cartStore";


</script>


<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    
<!-- Link to Bootstrap Stylesheet-->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">

<link rel="stylesheet" href="/css/style.css">


<section>
    <h2>Shopping Cart</h2>
    
    {#if $cart.items.length === 0}
        <p>Your Cart is empty</p>
    {:else}
        <ul>
            {#each $cart.items as item (item.id)}
            <li class="cart-item">

                <div><!-- Product Image -->

                <img src={"/productImage/" + item.image} alt={item.name} width="80" height="80" />

                </div>
            
            <div class="item-info">
                <h4>{item.name}</h4>
                <p>${item.price.toFixed(2)} x {item.quantity}</p>
                <button on:click={() => cart.removeItem(item.id)}>Remove</button>
            </div>
            </li>
            {/each}
        </ul>

        <p><b>Total:</b> ${$cart.total.toFixed(2)}</p>
        <button on:click={() => cart.clear()}>Clear Cart</button>
        
    {/if}

</section>