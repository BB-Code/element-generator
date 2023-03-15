const { DialogGenerator } = require('../template/dialog');
const fs = require('fs');
const path = require('path');
let result = DialogGenerator({
    name: 'Affiliation',
    width: 400,
    type: 1,
    itemArray: [
        {
            name: 'select', label: '变更后业务员', prop: 'counterman', model: 'counterman'
        },
        {
            name: 'input', label: '原因', prop: 'reason', model: 'reason'
        }
    ],
})

fs.writeFile(path.join(__dirname, '../dist/1.txt'), result, 'utf8', (err) => {
    if (err) console.log(err)
    console.log('successful')
})