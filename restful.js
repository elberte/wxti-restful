const mongoose = require('mongoose')

module.exports = (app, auth) => (base, uri) => {
  let model = mongoose.model(uri)

  function buildFilter(req) {
    let q = {}
    if(req.query.q) {
      q = req.query.q.split(',').map(item => {
        let terms = item.split(':')

        if(terms[0].endsWith('[regex]')) {
          return {[terms[0].replace('[regex]', '')]: new RegExp(`${terms[1]}`, 'gi') }
        } else {
          return {[terms[0]]: terms[1]}
        }
      })

      q = { $and: q }
    }

    return q
  }

  function buildProjection(req) {
    let projection = {}
    if(req.query.fields) {
      req.query.fields.split(',').map(item => {
        projection[item] = 1
      })
    }
    return projection
  }

  async function load(req, res) {
    try {
      const projection = buildProjection(req)
      let r = await model.findOne({ _id: req.params.id }, projection).lean()
      res.json({ status: 'OK', register: r })
    } catch (err) {
        res.json({ status: 'FAIL', err: err.message })
    }
  }

  async function find(req, res) {
    try {
      const filters = buildFilter(req)
      const projection = buildProjection(req)

      const count = await model.countDocuments(filters)
      const r = await model.find(filters, projection)
      .skip(req.query.skip ? parseInt(req.query.skip) : 0)
      .limit(req.query.limit ? parseInt(req.query.limit) : 0)
      .sort(req.query.sort ? req.query.sort.replace(/,/g, ' ') : '')
      .lean()

      res.json({ status: 'OK', count, registers: r })
    } catch (err) {
      res.json({ status: 'FAIL', err: err.message })
    }
  }

  async function create(req, res) {
    try {
      let r = new model(req.body)
      await r.save()
      if (r._id) {
        res.json({ status: 'OK', register: r })
      }
      else
        res.json({ status: 'FAIL' })
    } catch (err) {
      res.json({ status: "FAIL", err })
    }
  }
    
  async function update(req, res) {
    try {
      let r = await model.findOne({ _id: req.params.id })

      // control fields remove
      delete(req.body._id)
      delete(req.body.__v)

      for(let key in req.body) { r[ key ] = req.body[ key ] }
      r.save()
      res.json({ status: "OK" })
    } catch (err) {
        res.json({ status: "FAIL", err: err.message })
    }
  }
    
  async function remove(req, res) {
    try {
      let r = await model.findOne({ _id: req.params.id })
      r.remove()
      res.json({ status: "OK" })
    } catch ( err ) {
        res.json({ status: "FAIL", err: err.message })
    }
  }

  function populate({ populate, param }) {
    app.get(`${base}/${uri}/:id${param}`, async (req, res) => {
      try {
        const projection = buildProjection(req)
        let r = await model.findOne({ _id: req.params.id }, projection).populate(populate).lean()
        res.json({ status: 'OK', register: r })
      } catch (err) {
          res.json({ status: 'FAIL', err: err.message })
      }
    })

    app.get(`${base}/${uri}${param}`, async (req, res) => {
      try {
        const filters = buildFilter(req)
        const projection = buildProjection(req)
  
        const count = await model.countDocuments(filters)
        const r = await model.find(filters, projection).populate(populate)
        .skip(req.query.skip ? parseInt(req.query.skip) : 0)
        .limit(req.query.limit ? parseInt(req.query.limit) : 0)
        .sort(req.query.sort ? req.query.sort.replace(/,/g, ' ') : '')
        .lean()
  
        res.json({ status: 'OK', count, registers: r })
      } catch (err) {
        res.json({ status: 'FAIL', err: err.message })
      }
    })
  }

  async function route(method, param, callback) {
    switch(method) {
      case 'get':
        app.get(`${base}/${uri}${param}`, callback)
        break;
      case 'put':
        app.put(`${base}/${uri}${param}`, callback)
        break;
      case 'post':
        app.post(`${base}/${uri}${param}`, callback)
        break;
      case 'delete':
        app.delete(`${base}/${uri}${param}`, callback)
        break;
      case 'patch':
        app.patch(`${base}/${uri}${param}`, callback)
        break;
    }
  }

  function build () {
    app.get(`${base}/${uri}`, find.bind(this))
    app.put(`${base}/${uri}`, create.bind(this))
    app.post(`${base}/${uri}/:id`, update.bind(this))
    app.get(`${base}/${uri}/:id`, load.bind(this))
    app.delete(`${base}/${uri}/:id`, remove.bind(this))
  }

  return {
      populate,
      route,
      build
  }
}