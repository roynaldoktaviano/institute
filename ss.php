<?php

if ( ! defined( 'ABSPATH' ) ) exit;


// Inject CSS
add_action('wp_head', function () {
    ?>
<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap');

.custom-product-card.out-of-stock {
    position: relative;
    opacity: 1;
}

.custom-product-card.out-of-stock::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #f3f4f6;
    opacity: 0.4;
    z-index: 1;
    border-radius: 12px;
    font-family: "Plus Jakarta Sans" !important;
    pointer-events: none;
}

ul.products {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    /* atau ubah sesuai lebar item */
    gap: 20px;
}

ul.products li.product {
    display: flex;
    flex-direction: column;

}

.woocommerce ul.products li.product {
    width: inherit !important;
}

.woocommerce ul.products::before {
    content: none !important;
}



.add_to_cart_button,
.button.product-detail-link {
    display: none !important;
}

.custom-product-card {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e5e5e5;
    padding: 14px;
    text-align: center;
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1 1 auto;
}

.button.product_type_variable {
    display: none !important;
}



.button-area-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-top: 20px;
}

.button-area-row .btn-cart.icon-only {
    width: 44px;
    height: 44px;
    background-color: #d61d31;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    text-decoration: none;
    padding: 0;
}

.button-area-row .btn-cart.icon-only svg {
    width: 20px;
    height: 20px;
    fill: white;
}

.button-area-row .btn-detail {
    flex: 1;
    padding: 10px;
    text-align: center;
    background-color: #374151;
    color: white;
    border-radius: 6px;
    text-decoration: none;
    font-weight: bold;
    font-family: "Plus Jakarta Sans", sans-serif;
}


.custom-product-card .badge-diskon {
    position: absolute;
    top: 0;
    left: 0;
    background: #e74c3c;
    color: white;
    padding: 6px 10px;
    font-size: 14px;
    font-weight: bold;
    border-bottom-right-radius: 8px;
    z-index: 1;
    font-family: "Plus Jakarta Sans" !important;
}

.custom-product-card .custom-labels {
    display: flex;
    justify-content: flex-start;
    gap: 10px;
    margin: 8px 0;
}

.custom-labels-detail {
    display: flex !important;
    justify-content: flex-start;
    gap: 10px;
}

.custom-product-card .label {
    font-size: 11px;
    font-weight: bold;
    color: white;
    padding: 4px 6px;
    border-radius: 4px;
}

.free-ongkir-img,
.poin-img {
    width: 45px;
    object-fit: contain !important;
}

.theme-section .section-content {
    box-sizing: content-box !important;
}

.titelNew {
    font-family: "Plus Jakarta Sans" !important;
    font-size: 14px !important;
    line-height: 1.7em !important;
    margin: 0 !important;
    padding: 0 !important;
    text-align: left !important;
    color: black !important;
    justify-content: left !important;
}

.titleNew:hover {
    color: black !important;
}

.tve-theme-48 .content-section .shop-template-wrapper .type-product.product {
    padding: 0 !important;
}

.star-rating {
    display: none !important;
}

.advanced-woo-labels {
    display: none !important;
}

.product_type_simple {
    display: none !important;
}

.custom-product-card .product-price {
    margin-top: 6px;
    font-size: 16px;
    text-align: left !important;
}

.custom-product-card .priceNew {
    text-decoration: line-through;
    color: #999;
    display: block;
    font-size: 12px;
    font-family: "Plus Jakarta Sans" !important;
}

.jakartaa {
    font-family: "Plus Jakarta Sans" !important;
}

.custom-product-card .salepriceNew {
    color: #d61f31;
    font-weight: bold;
    font-size: 16px;
    font-family: "Plus Jakarta Sans" !important;
}



.custom-product-card h2 {
    font-size: 16px;
    min-height: 48px;
    margin: 10px 0 5px;
    font-family: "Plus Jakarta Sans" !important;
}

.custom-product-card img {
    max-height: 180px;
    object-fit: contain;
    width: 100%;
}

.custom-product-card .button-area {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.custom-product-card .button-area a {
    display: block;
    padding: 8px;
    text-align: center;
    border-radius: 6px;
    text-decoration: none;
    font-weight: bold;
    font-family: "Plus Jakarta Sans" !important;
}

.custom-product-card .btn-detail {
    background-color: #374151;
    color: white;
}

.custom-product-card .btn-cart {
    background-color: #d61f31;
    color: white;
}

.text-badge {
    height: fit-content;
    padding: 4px 11px;
    border-radius: 6px;
    background-color: rgb(0 173 19) !important;
    font-family: 'Plus Jakarta Sans' !important;
    font-size: 14px !important;
    font-weight: bold !important;
    color: white !important;


}

.badgeDetail {
    width: 8% !important;
    object-fit: contain !important;
}

.custom-labels img {
    width: 23%;
    object-fit: contain !important;
}

.free-ongkir-detail {
    width: 50px !important;
    object-fit: contain !important;
}

@media (min-width: 300px) {
    .tve-theme-48 .content-section .shop-template-wrapper .product .woocommerce-loop-product__title {
        font-size: 14px !important;
    }

    .tve-theme-63680 .content-section .shop-template-wrapper .type-product.product {
        padding: 0 !important;
    }

    .tve-theme-63680 .content-section .shop-template-wrapper .product .woocommerce-loop-product__title {
        font-family: "Plus Jakarta Sans" !important;
    }
}

@media (max-width: 767px) {

    /*ul.products {*/
    /*  grid-template-columns: repeat(2, 1fr);*/
    /*}*/
    .tcb-woo-shop {
        padding: 0 !important;
    }

    ul.products {
        display: grid;
        grid-template-columns: 50% 50%;
        gap: 6px;
    }

    .tve-theme-48 .content-section .shop-template-wrapper {
        padding: 0 !important;
    }

    .text-badge {
        font-size: 12px !important;
    }
}
</style>
<?php
});

add_action('init', function () {
    remove_action('woocommerce_before_shop_loop_item_title', 'woocommerce_template_loop_product_thumbnail', 10);
     remove_action('woocommerce_shop_loop_item_title', 'woocommerce_template_loop_product_title', 10);
        remove_action('woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_price', 10);
});

add_action('woocommerce_before_shop_loop_item_title', 'doran_custom_product_card_open', 5);
add_action('woocommerce_after_shop_loop_item', 'doran_custom_product_card_close', 100);

function doran_custom_product_card_open() {
    global $product;
    if ( ! $product || ! is_a( $product, 'WC_Product' ) ) return;
    
    $stock_status = $product->get_stock_status();
    $product_cats = wp_get_post_terms( $product->get_id(), 'product_cat', array( 'fields' => 'names' ) );

    // Handle harga dan diskon
    $discount_pct = 0;
    $is_variable = $product->is_type('variable');
    $min_price = $max_price = $product->get_price();
    
    // Syarat Free Ongkir
    $min_ongkir = 3000000;
    $min_dji = 10000000;
    $max_dji = 20000000;
    $bottom_dji = 2999999;
    $min_jete = 500000;
    $min_smartphone = 5000000;
    $allowed_categories = array('Garmin', 'Xiaomi', 'GoPro', 'Insta360', 'Saramonic', 'COROS','DJI');
    $diskon_categories = array('DJI');
    $jete_categories = array('JETE');
    $smartphone_categories = array('Smartphone');

    
    $has_free_shipping = (
        $min_price >= $min_ongkir &&
        array_intersect($allowed_categories, $product_cats)
    );
    
    $has_cicilan = (
        $min_price >= $min_jete
    );
    
    $has_diskon_smart = (
        $min_price >= $min_smartphone &&
        array_intersect($smartphone_categories, $product_cats)
    );
    
    
    $has_diskon_jete = (
        array_intersect($jete_categories, $product_cats)&&
        !in_array('Bundling Starterpack', $product_cats)
    );
    
     $has_diskon_ongkir = (
        $min_price >= $min_dji &&
        $min_price <= $max_dji &&
        array_intersect($diskon_categories, $product_cats)
    );
    
     $has_diskon_ongkir_500 = (
        $min_price > $max_dji &&
        array_intersect($diskon_categories, $product_cats)
    );
    
    $has_diskon_ongkir_50 = (
        $min_price > $bottom_dji &&
        $min_price < $min_dji &&
        array_intersect($diskon_categories, $product_cats)
    );


    if ( $is_variable ) {
        $variation_prices = [];

        foreach ($available_variations as $var) {
            if (isset($var['display_price'])) {
                $variation_prices[] = $var['display_price'];
            }
        }


        if ( ! empty($variation_prices) ) {
            $min_price = min($variation_prices);
            $max_price = max($variation_prices);
        }
    } else {
        $regular_price = (float) $product->get_regular_price();
        $sale_price    = (float) $product->get_sale_price();
        if ( $regular_price > 0 && ! empty($sale_price) && $sale_price < $regular_price ) {
            $discount_pct = round( ( ( $regular_price - $sale_price ) / $regular_price ) * 100 );
        }
    }

    $card_classes = 'custom-product-card';
        if ( ! $product->is_in_stock() ) {
            $card_classes .= ' out-of-stock';
        }
        echo '<div class="' . esc_attr($card_classes) . '">';

    // Badge diskon
    if ( $product->is_type( 'variable' ) ) {
    $regular_price = $product->get_variation_regular_price( 'min' );
    $sale_price    = $product->get_variation_sale_price( 'min' );

    if ( $regular_price && $sale_price && $regular_price > $sale_price ) {
        $discount_pct = round( ( ( $regular_price - $sale_price ) / $regular_price ) * 100 );
        echo '<div class="badge-diskon">-' . $discount_pct . '%</div>';
    }

} else {
    // produk simple
    $regular_price = $product->get_regular_price();
    $sale_price    = $product->get_sale_price();

    if ( $regular_price && $sale_price && $regular_price > $sale_price ) {
        $discount_pct = round( ( ( $regular_price - $sale_price ) / $regular_price ) * 100 );
        echo '<div class="badge-diskon">-' . $discount_pct . '%</div>';
    }
}

    // Badge Out of Stock
    if ( ! $product->is_in_stock() ) {
        echo '<div class="badge-diskon" style="background:#6b7280; ">Out of Stock</div>';
    }

    // Gambar Produk
    echo '<div class="product-thumbnail">';
    echo '<a href="' . get_the_permalink() . '">' . $product->get_image() . '</a>';
    echo '</div>';

    // Label Free Ongkir & Poin
    echo '<div class="custom-labels">';
    // echo '<img class="free-ongkir-img" src="https://dorangadget.com/wp-content/uploads/2025/07/free-ongkir.png" alt="Free Ongkir">';
    if ( $has_free_shipping ) {
        echo '<img class="free-ongkir-img" src="https://dorangadget.com/wp-content/uploads/2025/09/NEW-ICON-DG-FREE-ONGKIR-GENERAL.jpg" alt="Free Ongkir">';
    }
    // if($has_diskon_ongkir) {
    //     echo '<img class="free-ongkir-img" src="https://dorangadget.com/wp-content/uploads/2025/09/NEW-ICON-DG-FREE-ONGKIR-300K.jpg" alt="Diskon Ongkir 300K">';
    // }
    // if($has_diskon_ongkir_500) {
    //     echo '<img class="free-ongkir-img" src="https://dorangadget.com/wp-content/uploads/2025/09/NEW-ICON-DG-500K.jpg" alt="Diskon Ongkir 500K">';
    // }
    // if($has_diskon_ongkir_50) {
    //     echo '<img class="free-ongkir-img" src="https://dorangadget.com/wp-content/uploads/2025/09/NEW-ICON-DG-FREE-ONGKIR-50K.jpg" alt="Diskon Ongkir 500K">';
    // }
    if($has_diskon_jete) {
       echo '<img class="free-ongkir-img" src="https://dorangadget.com/wp-content/uploads/2025/09/NEW-ICON-DG-VOUCHER-Disc.jpg" alt="Diskon Ongkir 500K">';
    }
    // if($has_diskon_smart) {
    //     echo '<img class="free-ongkir-img" src="https://dorangadget.com/wp-content/uploads/2025/09/NEW-ICON-DG-VOUCHER-Disc.jpg" alt="Diskon Ongkir 500K">';
    // }
    if($has_cicilan) {
        echo '<img class="free-ongkir-img" src="https://dorangadget.com/wp-content/uploads/2025/09/NEW-ICON-DG-CICILAN.jpg" alt="Diskon Ongkir 500K">';
    }
 
    echo '<img class="poin-img" src="https://dorangadget.com/wp-content/uploads/2025/09/NEW-ICON-DG-POIN-BELANJA.jpg" alt="Poin Belanja">';
    echo '</div>';

    // Nama Produk
    echo '<a href="' . get_the_permalink() . '" class="woocommerce-loop-product__title titelNew">' . get_the_title() . '</a>';
    
  $averagen = doran_get_average_rating(get_the_ID());

if ($averagen !== null) {
    echo '<div class="doran-rating" style="margin-top:6px;text-align:left;">';
    // echo "<script>console.log('Average rating: " . get_the_ID() .  esc_js($averagen) . "');</script>";
    for ($i = 1; $i <= 5; $i++) {
        $star_color = $i <= round($averagen) ? '#f5b301' : '#ddd';
        echo '<span style="color:' . $star_color . ';font-size:14px;">★</span>';
    }
      if ($averagen !== "") {
        echo ' <span style="font-size:13px;color:#555;">(' . number_format($averagen, 1) . ')</span>';
    }
    echo '</div>';
}


    // Harga Produk
   echo '<div class="product-price">';

if ( $is_variable ) {
    $min_regular_price = $product->get_variation_regular_price( 'min', true );
    $max_regular_price = $product->get_variation_regular_price( 'max', true );
    $min_sale_price    = $product->get_variation_sale_price( 'min', true );
    $max_sale_price    = $product->get_variation_sale_price( 'max', true );

    // Ada sale price
    if ( $min_sale_price && $min_sale_price < $min_regular_price ) {
        if ( $min_sale_price == $max_sale_price ) {
            // Sale sama semua variation
            echo '<span class="regular-price priceNew">' . wc_price($min_regular_price) . '</span>';
            echo '<span class="sale-price salepriceNew">' . wc_price($min_sale_price) . '</span>';
        } else {
            // Range sale price
            echo '<span class="regular-price priceNew">' . wc_price($min_regular_price) . ' - ' . wc_price($max_regular_price) . '</span>';
            echo '<span class="sale-price salepriceNew">' . wc_price($min_sale_price) . ' - ' . wc_price($max_sale_price) . '</span>';
        }
    } else {
        // Tidak ada sale price
        if ( $min_regular_price == $max_regular_price ) {
            echo '<span class="sale-price salepriceNew">' . wc_price($min_regular_price) . '</span>';
        } else {
            echo '<span class="sale-price salepriceNew">' . wc_price($min_regular_price) . ' - ' . wc_price($max_regular_price) . '</span>';
        }
    }
} else {
    if ( $product->is_on_sale() ) {
        echo '<span class="regular-price priceNew">' . wc_price($regular_price) . '</span>';
    }
    echo '<span class="sale-price salepriceNew">' . wc_price($product->get_price()) . '</span>';
}

echo '</div>';

}


function doran_custom_product_card_close() {
    global $product;
    if ( ! $product || ! is_a( $product, 'WC_Product' ) ) return;

    $product_id = $product->get_id();
    $quantity = 1;

    echo '<div class="button-area-row">';

    // Tombol add-to-cart (jika bukan variable dan in stock)
    if ( $product->is_in_stock() && ! $product->is_type('variable') ) {
        echo '<a class="btn-cart icon-only" href="' . esc_url( home_url( "/?add-to-cart={$product_id}&quantity={$quantity}" ) ) . '" title="Tambah ke Keranjang">';
        echo '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 24 24">
    <path d="M7 18c-1.104 0-2 .897-2 2s.896 2 2 2c1.103 0 2-.897 2-2s-.897-2-2-2zm10 0c-1.104 0-2 .897-2 2s.896 2 2 2c1.103 0 2-.897 2-2s-.897-2-2-2zm-11.751-2l-.285-1h11.879c.818 0 1.543-.491 1.848-1.23l3.257-7.765a.999.999 0 0 0-.92-1.38h-16.44l-.563-2.447a.999.999 0 0 0-.977-.758h-2.5c-.553 0-1 .447-1 1s.447 1 1 1h1.735l2.595 11.272a1 1 0 0 0 .977.758h12.25c.553 0 1-.447 1-1s-.447-1-1-1h-11.474z"/>
  </svg>';
        echo '</a>';
    }

    // Tombol lihat detail
    echo '<a class="btn-detail jakartaa" href="' . get_the_permalink() . '">Detail</a>';

    echo '</div>'; // end .button-area-row
    echo '</div>'; // end .custom-product-card
}


function doran_custom_product_badge_above_title() {
    global $product;

    if ( ! $product || ! is_a( $product, 'WC_Product' ) ) return;

    $discount_pct = 0;
    $is_variable = $product->is_type('variable');
    $min_price = $max_price = $product->get_price();

    // Syarat Free Ongkir dan Diskon
    $min_ongkir = 3000000;
    $min_dji = 10000000;
    $max_dji = 20000000;
    $bottom_dji = 2999999;
    $min_jete = 500000;
    $min_smartphone = 5000000;

    $allowed_categories = array('Garmin', 'Xiaomi', 'GoPro', 'Insta360', 'Saramonic', 'COROS');
    $diskon_categories = array('DJI');
    $jete_categories = array('JETE');
    $smartphone_categories = array('Smartphone');

    // Ambil kategori produk
    $terms = get_the_terms($product->get_id(), 'product_cat');
    $product_cats = array();

    if ($terms && ! is_wp_error($terms)) {
        foreach ($terms as $term) {
            $product_cats[] = $term->name;
        }
    }

    // Aturan badge
    $has_free_shipping = (
        $min_price >= $min_ongkir &&
        array_intersect($allowed_categories, $product_cats)
    );

    $has_cicilan = (
        $min_price >= $min_jete
    );

    $has_diskon_smart = (
        $min_price >= $min_smartphone &&
        array_intersect($smartphone_categories, $product_cats)
    );

    $has_diskon_jete = (
        array_intersect($jete_categories, $product_cats) &&
        !in_array('Bundling Starterpack', $product_cats)
    );

    $has_diskon_ongkir = (
        $min_price >= $min_dji &&
        $min_price <= $max_dji &&
        array_intersect($diskon_categories, $product_cats)
    );

    $has_diskon_ongkir_500 = (
        $min_price > $max_dji &&
        array_intersect($diskon_categories, $product_cats)
    );

    $has_diskon_ongkir_50 = (
        $min_price > $bottom_dji &&
        $min_price < $min_dji &&
        array_intersect($diskon_categories, $product_cats)
    );

    // Output badge
    echo '<div class="custom-labels-detail" style="margin-bottom: 10px;">';

 if ( $has_free_shipping ) {
        echo '<img class="free-ongkir-detail" src="https://dorangadget.com/wp-content/uploads/2025/09/NEW-ICON-DG-FREE-ONGKIR-GENERAL.jpg" alt="Free Ongkir">';
    }
    // if($has_diskon_ongkir) {
    //     echo '<img class="free-ongkir-detail" src="https://dorangadget.com/wp-content/uploads/2025/09/NEW-ICON-DG-FREE-ONGKIR-300K.jpg" alt="Diskon Ongkir 300K">';
    // }
    // if($has_diskon_ongkir_500) {
    //     echo '<img class="free-ongkir-detail" src="https://dorangadget.com/wp-content/uploads/2025/09/NEW-ICON-DG-500K.jpg" alt="Diskon Ongkir 500K">';
    // }
    // if($has_diskon_ongkir_50) {
    //     echo '<img class="free-ongkir-detail" src="https://dorangadget.com/wp-content/uploads/2025/09/NEW-ICON-DG-FREE-ONGKIR-50K.jpg" alt="Diskon Ongkir 500K">';
    // }
    if($has_diskon_jete) {
       echo '<img class="free-ongkir-img" src="https://dorangadget.com/wp-content/uploads/2025/09/NEW-ICON-DG-VOUCHER-Disc.jpg" alt="Diskon Ongkir 500K">';
    }
    // if($has_diskon_smart) {
    //     echo '<img class="free-ongkir-detail" src="https://dorangadget.com/wp-content/uploads/2025/09/NEW-ICON-DG-VOUCHER-Disc.jpg" alt="Diskon Ongkir 500K">';
    // }
    if($has_cicilan) {
        echo '<img class="free-ongkir-detail" src="https://dorangadget.com/wp-content/uploads/2025/09/NEW-ICON-DG-CICILAN.jpg" alt="Diskon Ongkir 500K">';
    }

    
    echo '<img class="free-ongkir-detail" src="https://dorangadget.com/wp-content/uploads/2025/09/NEW-ICON-DG-POIN-BELANJA.jpg" alt="Poin Belanja">';
    echo '</div>';
}
add_action('woocommerce_single_product_summary', 'doran_custom_product_badge_above_title', 20);


function doran_get_average_rating($product_id) {

    if (!function_exists('wc_get_product')) {
        return null;
    }

    $cache_key = 'doran_avg_rating_' . $product_id;
    $cached = get_transient($cache_key);
    if ($cached !== false) {
        return $cached;
    }

    $product = wc_get_product($product_id);
    if (!$product) return null;

    $average = null;
    $totalStars = 0;
    $totalReviews = 0;
    $product_ids = [];

    if ($product->is_type('variable')) {
        $product_ids = $product->get_children();
    } else {
        $product_ids = [$product_id];
    }

    foreach ($product_ids as $id) {
        $url = "https://kasir.doran.id/api/item_review/{$id}?type=wp_id";
        $response = wp_remote_get($url, ['timeout' => 5]);

        // Cek error koneksi
        if (is_wp_error($response)) {
            error_log('Doran Rating Error (HTTP) for ' . $id . ': ' . $response->get_error_message());
            continue;
        }

        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);

        if (!empty($data['data']) && !empty($data['data']['group_by_star']) && is_array($data['data']['group_by_star'])) {
            foreach ($data['data']['group_by_star'] as $group) {
                $star = isset($group['star']) ? intval($group['star']) : 0;
                $count = isset($group['total']) ? intval($group['total']) : 0;

                if ($count > 0 && $star > 0) {
                    $totalStars += $star * $count;
                    $totalReviews += $count;
                }
            }
        } else {
            error_log('Doran Rating: invalid or empty group_by_star for ID ' . $id);
        }
    }

    if ($totalReviews > 0) {
        $average = round($totalStars / $totalReviews, 1);
    } else {
        $average = null; // kosongkan kalau tidak ada review sama sekali
    }

    set_transient($cache_key, $average, HOUR_IN_SECONDS);

    return $average;
}






add_filter('woocommerce_get_item_data', function($item_data, $cart_item) {
    // Ambil ID produk
    $product_id = $cart_item['product_id'];

    // Cache sementara agar tidak panggil API berulang kali
    static $review_cache = [];

    if (isset($review_cache[$product_id])) {
        $average_rating = $review_cache[$product_id];
    } else {
        // Ambil data dari API
        $response = wp_remote_get("https://kasir.doran.id/api/item_review/{$product_id}?type=wp_id", [
            'timeout' => 5,
        ]);

        $average_rating = null;

        if (!is_wp_error($response)) {
            $body = wp_remote_retrieve_body($response);
            $data = json_decode($body, true);

            if (isset($data['average'])) {
                $average_rating = floatval($data['average']);
            } elseif (isset($data['data']['average'])) {
                $average_rating = floatval($data['data']['average']);
            }
        }

        // Simpan hasil di cache statis
        $review_cache[$product_id] = $average_rating;
    }

    if ($average_rating !== null) {
        // Buat tampilan bintang (emoji atau HTML)
        $stars = '';
        for ($i = 1; $i <= 5; $i++) {
            $stars .= $i <= round($average_rating) ? '⭐' : '☆';
        }

        $item_data[] = [
            'name'  => __('Rating', 'woocommerce'),
            'value' => sprintf('%s (%.1f)', $stars, $average_rating),
        ];
    }

    return $item_data;
}, 10, 2);



// Shortcode untuk list produk custom dengan style card dari doran_custom_product_card
add_shortcode('custom_product_list', function($atts) {
    $atts = shortcode_atts([
        'category' => '',
        'limit'    => 8
    ], $atts, 'custom_product_list');

    if (empty($atts['category'])) {
        return '<p>Parameter category belum diisi.</p>';
    }

    ob_start();

    $args = [
        'post_type'      => 'product',
        'posts_per_page' => intval($atts['limit']),
        'tax_query'      => [
            [
                'taxonomy' => 'product_cat',
                'field'    => 'slug',
                'terms'    => sanitize_text_field($atts['category'])
            ]
        ]
    ];

    $loop = new WP_Query($args);

    if ($loop->have_posts()) {
        echo '<ul class="products">';

        while ($loop->have_posts()) {
            $loop->the_post();
            global $product;

            // Buka card sesuai style custom
            doran_custom_product_card_open();

            // Tutup card sesuai style custom
            doran_custom_product_card_close();
        }

        echo '</ul>';
    } else {
        echo '<p>Produk tidak ditemukan.</p>';
    }

    wp_reset_postdata();

    return ob_get_clean();
});