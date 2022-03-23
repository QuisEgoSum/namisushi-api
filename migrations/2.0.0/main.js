/* eslint-disable */
const mongoose = require('mongoose')


;(async function() {
  await mongoose.connect(process.argv[2])
  await mongoose.connection.collection('categories').rename('product_categories')
  await mongoose.connection.collection('product_categories').updateMany(
    {productIds: {$exists: false}},
    {$set: {productIds: []}}
  )
  const productsCategories = await mongoose.connection.collection('products')
    .find({'categories.0': {$exists: true}})
    .toArray()
  await Promise.all(
    productsCategories.map(
      product => mongoose.connection.collection('product_categories')
        .updateMany(
          {_id: {$in: product.categories}},
          {$addToSet: {productIds: product._id}}
        )
    )
  )
  productsCategories.length = 0
  await mongoose.connection.collection('products')
    .updateMany({type: {$exists: false}}, {$set: {type: 'SINGLE'}})
  await mongoose.connection.collection('products')
    .updateMany(
      {show: {$exists: true}},
      [
        {$set: {visible: '$show'}},
        {$unset: {show: true}}
      ]
    )
  const productImages = await mongoose.connection.collection('products')
    .find({'images.0': {$exists: true}})
    .toArray()
  await Promise.all(
    productImages.map(
      product => mongoose.connection.collection('products')
        .updateOne(
          {_id: product._id},
          {$set: {images: product.images.map(image => image.replace(/\/image\/product\//, ''))}}
        )
    )
  )
  await mongoose.connection.collection('users').updateMany({telegramId: {$exists: false}}, {$set: {telegramId: null}})
  //TODO: orders deliveryCost, number, discount, (products.cost & weight / number), discount percent
  //TODO: order.cost + order.deliveryCost
})()
  .catch(console.error)
  .finally(() => mongoose.disconnect())