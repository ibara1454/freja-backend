import express from 'express';
import bodyParser from 'body-parser';
import proxy from './proxy';

const app = express();

// Declare local variable `settings` within this application.
app.locals.settings = [];

app.use(bodyParser());

// Not really sure this setting is needed
// Allow CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// GET /settings
// Get the proxy transformation rules
app.get('/settings', (req, res) => {
  res.json(app.locals.settings);
});

// POST /settings
// Set the proxy transformation rules
app.post('/settings', (req, res) => {
  app.locals.settings = req.body;
  res.json(req.body);
});

// Listen on `ENV['PORT']` or 3000
app.listen(process.env.PORT || 3000);

// Receives settings before each request / response
const getRules = () => {
  const { settings } = app.locals;
  return settings.map((rule) => {
    const matcher = new RegExp(rule.matcher);
    return { ...rule, matcher };
  });
};

// Start proxy server by given options
proxy({ getRules });
