var express = require('express');
var router = express.Router();
var fs = require('fs');
var Order = require('./../models/Order')
var Pizza = require('./../models/Pizza')

const pizzas = [
  new Pizza("Vesuvio", 57),
  new Pizza("Amerikaner", 53),
  new Pizza("Caciatore", 57),
  new Pizza("Carbona", 63),
];

let orders = [
  new Order([ new Pizza('Pizza 1', 5), new Pizza('Pizza 2', 51) ]),
  new Order([ new Pizza('Pizza3', 5), new Pizza('Pizza5', 1) ]),
]

/* GET home page. */
router.get('/', function(req, res, next) {
  let selectedPizzas = (req.session.selectedPizzas || [])
      .map(p => pizzas.find(pizza => pizza.name == p))
      .filter(Boolean)
  if (req.accepts(['text', 'html'])) {    
    res.render('index', { orders, pizzas, selectedPizzas });
  } else {
    res.json({orders, pizzas, selectedPizzas })
  }
});

router.post('/add', function (req, res, next) {
  let selectedPizzas = req.body.selected_pizza || []
  let newPizza = req.body.new_pizza;
  
  newPizza = pizzas.find(p => p.name == newPizza);
  if(newPizza) {
    if (!Array.isArray(selectedPizzas)) {
      selectedPizzas = [ selectedPizzas ]
    }
    selectedPizzas.push(newPizza.name);
  }
  req.session['selectedPizzas'] = selectedPizzas
  res.redirect('/');
});

router.post('/save', function(req, res, next) {
  let selectedPizzas = req.body.pizza
  if (!Array.isArray(selectedPizzas)) {
    selectedPizzas = [ selectedPizzas ]
  }
  selectedPizzas = selectedPizzas
      .map(p => pizzas.find(pizza => pizza.name == p))
      .filter(Boolean)
  
  if (selectedPizzas.length) {
    delete req.session.selectedPizzas
    orders.push(new Order(selectedPizzas));
  }

  res.redirect('/');
});

router.get('/price', function (req, res, next) {
  let pizzaName = req.query.pizza;
  let pizza = pizzas.find(p => p.name == pizzaName);
  if (pizza === undefined) {
    res.sendStatus(404);
  } else {
    res.json(pizza.price);
  }
});

router.get('/delete/:idx', function (req, res, next){ 
  let idx = req.params.idx;
  if (idx) {
    orders.splice(idx, 1);
  }
  res.redirect('/');
});

module.exports = router;
