const propertiesConfig = [
    {
      id: 'currency',
      default: 'час'
    },
    {
      id: 'currency_form_1',
      default: 'час'
    },
    {
      id: 'currency_form_2',
      default: 'часа'
    },
    {
      id: 'currency_form_3',
      default: 'часов'
    },
    {
      id: 'currency_first',
      default: false
    },
    {
      id: 'wage',
      default: 1
    },
    {
      id: 'costLabel',
      default: 'Потрачено'
    },
  ]


function readSettings() {
    return browser.storage.sync.get(null);
}
