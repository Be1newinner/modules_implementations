const express = require('express');

const app = express();
const cors = require('cors');

app.use(cors(
    {
        origin: 'http://localhost:3000',
    }
));

app.use(express.json());

const productsCollection = [
    {
        id: 1,
        name: 'Product 1',
        price: 10.99,
        image: 'https://via.placeholder.com/150',
    },
    {
        id: 2,
        name: 'Product 2',
        price: 19.99,
        image: 'https://via.placeholder.com/150',
    },
    {
        id: 3,
        name: 'Product 3',
        price: 29.99,
        image: 'https://via.placeholder.com/150',
    },
]

const cart = []

app.post('/cart/increase/:id', (req, res) => {
    const { id } = req.params;

    const index = cart.findIndex((product) => product.id == id);

    if (index >= 0) {
        cart[index].quantity += 1;
    } else {
        const product = productsCollection.find((product) => product.id == id);
        product.quantity = 1;
        if (product) {
            cart.push(product);
        }
    }


    console.log(cart);
    res.status(200).json({ cart, message: 'Cart updated successfully' });
}
);

app.post('/cart/decrease/:id', (req, res) => {
    const { id } = req.params;
    const index = cart.findIndex((product) => product.id == id);

    if (index >= 0) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
    }


    console.log(cart);
    res.status(200).json({ cart, message: 'Cart updated successfully' });
}
);

app.post('/cart', (_req, res) => {

    console.log(cart);
    res.status(200).json({ cart });
}
);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
}
);