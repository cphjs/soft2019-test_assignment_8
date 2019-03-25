const webdriver = require('selenium-webdriver');
const assert = require('assert');

let rootUrl = 'http://localhost:3000/';
let driver = null;

before(() => {
    driver = new webdriver.Builder().forBrowser('firefox').build();
})

beforeEach(async () => {
    await driver.get(rootUrl)
})

after(async () => {
    await driver.close();
});

it('Enter order', async () => {
    let ddSelector = webdriver.By.name('new_pizza');
    let pizzaNames = ['Vesuvio', 'Amerikaner'];
    let addSelector = webdriver.By.id("addPizza");
    let saveSelector = webdriver.By.id('saveOrder');

    for (let pizza of pizzaNames) {
        let dropdown = await driver.findElement(ddSelector);
        let btn = await driver.findElement(addSelector);

        await dropdown.click();
        await dropdown.sendKeys(pizza);
        await btn.click();
    }
    let btn = await driver.findElement(saveSelector);
    await btn.click();

    for (let pizza of pizzaNames) {
        let el = await driver.findElement(async function (driver) {
            let elements = await driver.findElements(webdriver.By.tagName('li'))
            
            return elements.filter(async el => {
                let text = await el.getAttribute('textContent');
                return text.includes(pizza);
            });
        });

        assert(el);
    }
})

it('Can see orders', async () => {
    let orderSelector = webdriver.By.className('order');
    let orders = await driver.findElements(orderSelector);
    assert(orders.length > 0);
});

it('Order is deleted', async () => {
    let deleteLinkSelector = webdriver.By.className('close');
    let orderSelector = webdriver.By.className('order');
    let orders = await driver.findElements(orderSelector);
    let count = orders.length;
    
    let deleteLink = orders[0].findElement(deleteLinkSelector);
    await driver.executeScript("arguments[0].scrollIntoView(true);", deleteLink);
    await deleteLink.click();

    orders = await driver.findElements(orderSelector);
    let newCount = orders.length;

    assert(newCount === count - 1);
});