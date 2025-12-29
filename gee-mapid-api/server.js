const ee = require('@google/earthengine');
const express = require('express');
const app = express();

const privateKey = require('./service-account.json');

ee.data.authenticateViaPrivateKey(
  privateKey,
  () => ee.initialize(null, null, start),
  err => console.error(err)
);

function start() {

  app.get('/mangrove-height', async (req, res) => {
    const canopy = new ee.Image(
      'projects/meta-forest-monitoring/assets/CanopyHeight_2020'
    );

    const mangroves = new ee.Image(
      'projects/global-mangrove-watch-2020/gmw_v3_2020'
    ).select('mangrove');

    const mangroveHeight = canopy.updateMask(mangroves);

    const vis = {
      min: 0,
      max: 30,
      palette: ['2166ac','1a9850','fee08b','d73027']
    };

    const map = await mangroveHeight.getMap(vis);
    res.json(map);
  });

  app.listen(8080);
}
