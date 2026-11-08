import bcrypt from 'bcryptjs';
import { getDB, saveDB } from './db.js';

export async function seedDatabase() {
  const db = getDB();

  // 1. Seed Admin & Customer User if empty
  if (db.users.length === 0) {
    const adminPasswordHash = await bcrypt.hash('AdminPassword123!', 10);
    const customerPasswordHash = await bcrypt.hash('Customer123!', 10);

    db.users.push(
      {
        id: 'usr_admin_001',
        name: 'Classic Eco Administrator',
        email: 'admin@classiceco.com',
        phone: '01637778889',
        password: adminPasswordHash,
        role: 'admin',
        businessName: 'Classic Eco Product & Packaging',
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr_cust_001',
        name: 'Tanvir Hossain',
        email: 'tanvir@pizzalounge.bd',
        phone: '01711223344',
        password: customerPasswordHash,
        role: 'customer',
        businessName: 'Pizza Lounge Dhanmondi',
        address: 'House 42, Road 9/A, Dhanmondi, Dhaka',
        createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
      }
    );
  }

  // 2. Seed Categories if empty
  if (db.categories.length === 0) {
    db.categories.push(
      {
        id: 'cat_pizza',
        name: 'Pizza Boxes',
        slug: 'pizza-boxes',
        description: 'Heavy duty, food-grade corrugated pizza boxes with custom flexo & offset branding.',
        image: '/assets/aistudio/576123137_1135388445462123_728576114768601119_n_b3eb8401.jpg',
        itemCount: 2
      },
      {
        id: 'cat_burger',
        name: 'Burger & Meal Boxes',
        slug: 'burger-boxes',
        description: 'Sturdy greaseproof burger, sandwich, and combo meal packaging boxes.',
        image: '/assets/aistudio/573545226_1131316062536028_5369013656857067366_n_7e13fa43.jpg',
        itemCount: 2
      },
      {
        id: 'cat_cake',
        name: 'Cake & Pastry Boxes',
        slug: 'cake-boxes',
        description: 'Luxury confectionery packaging with transparent PET display windows and gold foil.',
        image: '/assets/images/luxury_cake_box_1794165037904.jpg',
        itemCount: 1
      },
      {
        id: 'cat_cups',
        name: 'Paper Cups & Holders',
        slug: 'paper-cups',
        description: 'Single wall, double wall, ripple insulated cups, lids, and acrylic counter organizers.',
        image: '/assets/images/eco_paper_coffee_cups_1794165037979.jpg',
        itemCount: 2
      },
      {
        id: 'cat_bags',
        name: 'Paper Bags',
        slug: 'paper-bags',
        description: 'Virgin kraft takeaway delivery bags with flat & twisted handles.',
        image: '/assets/aistudio/475576584_917925027208467_1462850462188352454_n_57279f78.jpg',
        itemCount: 1
      },
      {
        id: 'cat_custom',
        name: 'Custom Logo Packaging',
        slug: 'custom-packaging',
        description: 'Tailor-made restaurant branding from doner boxes, shawarma wraps to foil pouches.',
        image: '/assets/aistudio/475647917_917898843877752_1503328799674608950_n_d96fd093.jpg',
        itemCount: 1
      }
    );
  }

  // 3. Seed Products if empty
  if (db.products.length === 0) {
    db.products.push(
      {
        id: 'prod_pizza_01',
        name: 'Cheezybyte Luxury Black & Gold Corrugated Pizza Box',
        category: 'Pizza Boxes',
        categorySlug: 'pizza-boxes',
        description: 'Premium heavy-duty 3-ply corrugated pizza box featuring high-definition gold metallic print on matte black surface. Keeps pizza piping hot and crispy with integrated ventilation flaps.',
        price: 18.5,
        moq: 500,
        sizes: ['8 Inch (Small)', '10 Inch (Medium)', '12 Inch (Large)', '14 Inch (Family)'],
        material: '3-ply Virgin Kraft Food-Grade Corrugated Board (180 GSM)',
        isCustomizable: true,
        stockStatus: 'In Stock',
        featured: true,
        images: [
          '/assets/aistudio/576123137_1135388445462123_728576114768601119_n_b3eb8401.jpg',
          '/assets/aistudio/482224982_945054034495566_7266505851216969091_n_6cc058a7.jpg'
        ],
        rating: 4.9,
        reviewsCount: 38
      },
      {
        id: 'prod_pizza_02',
        name: 'Fresh and Tasty Artisanal Kraft Pizza Box',
        category: 'Pizza Boxes',
        categorySlug: 'pizza-boxes',
        description: 'Eco-conscious unbleached brown kraft pizza box printed with vibrant food-grade vegetable soy inks. Oil-resistant interior lining prevents grease leakage during delivery.',
        price: 16.0,
        moq: 500,
        sizes: ['8 Inch', '10 Inch', '12 Inch'],
        material: 'Food Grade Natural Brown Kraft Corrugated Board',
        isCustomizable: true,
        stockStatus: 'In Stock',
        featured: true,
        images: [
          '/assets/aistudio/482224982_945054034495566_7266505851216969091_n_6cc058a7.jpg'
        ],
        rating: 4.8,
        reviewsCount: 24
      },
      {
        id: 'prod_burger_01',
        name: 'Sky Lounge Custom Rooftop Burger Box',
        category: 'Burger & Meal Boxes',
        categorySlug: 'burger-boxes',
        description: 'Signature lock-top burger box with custom QR code printing and matte black luxury finish. Perfect for gourmet smashed burgers, fried chicken sandwiches, and loaded fries.',
        price: 8.5,
        moq: 1000,
        sizes: ['4.5" x 4.5" x 3.5" (Standard Burger)', '5.5" x 5.5" x 4.0" (Gourmet Double)'],
        material: '300 GSM Food Grade PE-Coated Virgin Duplex Board',
        isCustomizable: true,
        stockStatus: 'In Stock',
        featured: true,
        images: [
          '/assets/aistudio/573545226_1131316062536028_5369013656857067366_n_7e13fa43.jpg'
        ],
        rating: 5.0,
        reviewsCount: 42
      },
      {
        id: 'prod_doner_01',
        name: 'ARMA Triangular Doner & Shawarma Box',
        category: 'Custom Packaging',
        categorySlug: 'custom-packaging',
        description: 'Ergonomic easy-tear triangular packaging sleeve for doner kebabs, shawarma wraps, and rolls. Prevents messy sauce spills while preserving wrap warmth.',
        price: 6.2,
        moq: 1000,
        sizes: ['Standard Wrap 10"', 'Jumbo Wrap 12"'],
        material: '280 GSM Greaseproof Poly-Coated Food Board',
        isCustomizable: true,
        stockStatus: 'In Stock',
        featured: true,
        images: [
          '/assets/aistudio/475647917_917898843877752_1503328799674608950_n_d96fd093.jpg'
        ],
        rating: 4.9,
        reviewsCount: 19
      },
      {
        id: 'prod_bag_01',
        name: 'Good Food Heavy-Duty Kraft Takeaway Bag',
        category: 'Paper Bags',
        categorySlug: 'paper-bags',
        description: 'Reinforced square bottom kraft delivery bag with twisted rope handles. Generous 5-inch folding width easily accommodates stacked food boxes without tipping over.',
        price: 14.5,
        moq: 500,
        sizes: ['Height 8" x Wide 9" x Folding 5"', 'Height 10" x Wide 11" x Folding 6"'],
        material: '140 GSM High-Tensile Virgin Kraft Paper with Twisted Handle',
        isCustomizable: true,
        stockStatus: 'In Stock',
        featured: true,
        images: [
          '/assets/aistudio/475576584_917925027208467_1462850462188352454_n_57279f78.jpg'
        ],
        rating: 4.9,
        reviewsCount: 56
      },
      {
        id: 'prod_organizer_01',
        name: 'Commercial Acrylic 4-Tier Cup & Condiment Organizer',
        category: 'Paper Cups & Holders',
        categorySlug: 'paper-cups',
        description: 'Heavy-duty matte black acrylic dispenser unit for restaurant counters, cafe bars, and juice corners. Neatly organizes hot cups, cold PET cups, lids, stirrers, and sugar sachets.',
        price: 2450.0,
        moq: 1,
        sizes: ['4 Column Compact Countertop Unit'],
        material: 'High-Density 4mm Impact-Resistant Acrylic',
        isCustomizable: false,
        stockStatus: 'In Stock',
        featured: false,
        images: [
          '/assets/aistudio/475791250_917924827208487_576751020850652263_n_d74dd8c9.jpg'
        ],
        rating: 5.0,
        reviewsCount: 15
      },
      {
        id: 'prod_cake_01',
        name: 'Maison Du Caramel Luxury Gold Cake Box with Window',
        category: 'Cake & Pastry Boxes',
        categorySlug: 'cake-boxes',
        description: 'Opulent white and gold embossed bakery box featuring an anti-fog panoramic PET window. Includes grease-resistant cake board base for tier cakes and delicate bakery treats.',
        price: 45.0,
        moq: 200,
        sizes: ['8" x 8" x 6" (1-2 Pound)', '10" x 10" x 7" (3-4 Pound)', '12" x 12" x 8" (Large)'],
        material: '400 GSM Rigid Food-Grade Ivory Board with Metallic Foil Stamping',
        isCustomizable: true,
        stockStatus: 'In Stock',
        featured: true,
        images: [
          '/assets/images/luxury_cake_box_1794165037904.jpg'
        ],
        rating: 5.0,
        reviewsCount: 29
      },
      {
        id: 'prod_cup_02',
        name: 'Ripple Wall Insulated Eco Coffee Cups with Sip Lids',
        category: 'Paper Cups & Holders',
        categorySlug: 'paper-cups',
        description: 'Triple-wall insulated kraft coffee cups that eliminate the need for extra heat sleeves. Certified leak-proof with precision snap-fit ergonomic travel lids.',
        price: 4.8,
        moq: 1000,
        sizes: ['8 oz (240ml)', '12 oz (350ml)', '16 oz (480ml)'],
        material: 'Biodegradable PLA Lined Kraft Paperboard',
        isCustomizable: true,
        stockStatus: 'In Stock',
        featured: true,
        images: [
          '/assets/images/eco_paper_coffee_cups_1794165037979.jpg'
        ],
        rating: 4.8,
        reviewsCount: 33
      },
      {
        id: 'prod_bento_01',
        name: 'Eco-Friendly 3-Compartment Kraft Bento Lunch Box',
        category: 'Burger & Meal Boxes',
        categorySlug: 'burger-boxes',
        description: 'Leak-resistant sectional meal box designed for cloud kitchens, corporate catering, and rice/curry sets. Microwave friendly and freezer safe with interlocking lid tabs.',
        price: 11.5,
        moq: 500,
        sizes: ['800ml (2 Compartment)', '1000ml (3 Compartment)'],
        material: 'Heavyweight Food Safe Kraft with Plant-based Bio Lining',
        isCustomizable: true,
        stockStatus: 'In Stock',
        featured: true,
        images: [
          '/assets/images/kraft_bento_meal_box_1794165039216.jpg'
        ],
        rating: 4.7,
        reviewsCount: 21
      }
    );
  }

  // 4. Seed Testimonials if empty
  if (db.testimonials.length === 0) {
    db.testimonials.push(
      {
        id: 'test_01',
        name: 'Kazi Mahbubur Rahman',
        role: 'Founder & Head Chef',
        company: 'Sky Lounge Rooftop Kitchen, Barishal',
        comment: 'Classic Eco has elevated our restaurant image tremendously. The custom burger boxes and kraft bags with our logo are high-end, thick, and never get soggy. Fast delivery from Dhaka right to our doorstep.',
        rating: 5,
        avatar: 'KM'
      },
      {
        id: 'test_02',
        name: 'Farhan Tariq',
        role: 'Operations Director',
        company: 'Cheezybyte Pizza Chain, Dhaka',
        comment: 'We order 15,000 pizza boxes monthly from Classic Eco. The gold foil and corrugated durability keep our crust hot during 45-minute rain deliveries. Their pricing in Kakrail is unmatched.',
        rating: 5,
        avatar: 'FT'
      },
      {
        id: 'test_03',
        name: 'Sadia Nawsheen',
        role: 'Owner & Pastry Artist',
        company: 'Caramel Bliss Bakery, Banani',
        comment: 'Finding genuine luxury cake boxes with window clarity in Bangladesh was challenging until we partnered with Classic Eco. The finish and gold accents are world-class.',
        rating: 5,
        avatar: 'SN'
      }
    );
  }

  // 5. Seed FAQs if empty
  if (db.faqs.length === 0) {
    db.faqs.push(
      {
        id: 'faq_01',
        question: 'What is the Minimum Order Quantity (MOQ) for custom logo printing?',
        answer: 'Our standard MOQ for custom logo printing on pizza and burger boxes is 500 to 1,000 pieces depending on the sizing. For ready stock unprinted items, you can order smaller bundles starting at just 100 to 200 units.',
        category: 'Ordering'
      },
      {
        id: 'faq_02',
        question: 'How long does production and delivery take across Bangladesh?',
        answer: 'For in-stock ready packaging, delivery inside Dhaka takes 24 to 48 hours. For customized logo packaging, standard production takes 5 to 7 working days after design signoff. We ship nationwide via reliable courier partners (Sundarban, SA Paribahan, Steadfast).',
        category: 'Delivery'
      },
      {
        id: 'faq_03',
        question: 'Are your packaging products 100% food-grade and eco-friendly?',
        answer: 'Yes! All our papers, virgin kraft liners, PE barrier coatings, and vegetable-based soy inks comply with food contact hygiene regulations. They are greaseproof, odorless, and non-toxic for hot food.',
        category: 'Quality'
      },
      {
        id: 'faq_04',
        question: 'Can I visit your physical showroom in Kakrail, Dhaka?',
        answer: 'You are always welcome! Visit us at Shop 3/11, Karnophuli Garden City Shopping Complex, 109 Kakrail, Dhaka. You can inspect physical samples, paper thickness (GSM), and discuss custom sizes.',
        category: 'General'
      },
      {
        id: 'faq_05',
        question: 'What payment methods do you accept?',
        answer: 'We accept Cash on Delivery (COD) for standard orders, manual bKash/Nagad merchant transfers, and direct bank transfers for bulk commercial orders.',
        category: 'Payment'
      }
    );
  }

  // 6. Seed Sample Orders if empty
  if (db.orders.length === 0) {
    db.orders.push(
      {
        id: 'CEO-98214',
        customerName: 'Tanvir Hossain',
        phone: '01711223344',
        email: 'tanvir@pizzalounge.bd',
        address: 'House 42, Road 9/A, Dhanmondi, Dhaka',
        district: 'Dhaka',
        area: 'Dhanmondi',
        paymentMethod: 'bKash',
        paymentStatus: 'Paid',
        trxId: 'BKH998432101',
        orderStatus: 'Production',
        items: [
          {
            id: 'prod_pizza_01',
            name: 'Cheezybyte Luxury Black & Gold Pizza Box',
            size: '10 Inch (Medium)',
            price: 18.5,
            quantity: 1000,
            subtotal: 18500
          },
          {
            id: 'prod_bag_01',
            name: 'Good Food Heavy-Duty Kraft Takeaway Bag',
            size: 'Height 8" x Wide 9" x Folding 5"',
            price: 14.5,
            quantity: 500,
            subtotal: 7250
          }
        ],
        subtotal: 25750,
        deliveryFee: 0,
        total: 25750,
        notes: 'Please print urgent batch before the weekend.',
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
      },
      {
        id: 'CEO-98215',
        customerName: 'Shamsul Alam',
        phone: '01819876543',
        email: 'shamsul@chillandgrill.bd',
        address: 'GEC Circle, Nasirabad, Chattogram',
        district: 'Chattogram',
        area: 'GEC',
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'Pending',
        orderStatus: 'Confirmed',
        items: [
          {
            id: 'prod_burger_01',
            name: 'Sky Lounge Custom Rooftop Burger Box',
            size: '4.5" x 4.5" x 3.5"',
            price: 8.5,
            quantity: 1000,
            subtotal: 8500
          }
        ],
        subtotal: 8500,
        deliveryFee: 150,
        total: 8650,
        notes: 'Delivery via SA Paribahan GEC branch.',
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
      }
    );
  }

  // 7. Seed Sample Custom Quotes if empty
  if (db.quotes.length === 0) {
    db.quotes.push(
      {
        id: 'CEQ-71042',
        name: 'Rahim Chowdhury',
        businessName: 'The Shawarma King',
        phone: '01912345678',
        email: 'shawarmaking.bd@gmail.com',
        productType: 'Custom Doner & Shawarma Box',
        requiredQuantity: '5,000 Pcs',
        packagingSize: '11 x 4 x 4 Inches',
        materialPreference: '300 GSM Food Grade Virgin Board with Matte Lamination',
        status: 'Approved',
        quotedPrice: 32500,
        adminNotes: 'Price quoted at 6.5 BDT/pc for 5,000 units. Free plate fee.',
        instructions: 'We need gold foil logo on top and QR code linking to our Facebook page.',
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
      },
      {
        id: 'CEQ-71043',
        name: 'Nusrat Jahan',
        businessName: 'Doughnut Hub Sylhet',
        phone: '01798765432',
        email: 'doughnuthub.sylhet@gmail.com',
        productType: 'Cake & Pastry Box',
        requiredQuantity: '2,000 Pcs',
        packagingSize: '9 x 9 x 4 Inches with clear PVC window',
        materialPreference: '350 GSM White Bleached SBS Board',
        status: 'Pending',
        quotedPrice: null,
        adminNotes: '',
        instructions: 'Please check if you can make pastel pink background with gold typography.',
        createdAt: new Date().toISOString()
      }
    );
  }

  saveDB();
  console.log('Database seeded successfully with authentic Classic Eco packaging data.');
}
