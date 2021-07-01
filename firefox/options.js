function comment(val) {
  document.getElementById('comment').value = val
}

function saveOptions(e) {
    e.preventDefault();
    
    const propsSaved = propertiesConfig.reduce((obj, prop)=>{
      obj[prop.id] = document.getElementById(prop.id).value
      return obj
    }, {})
    document.getElementById('comment').value = JSON.stringify(propsSaved)
    browser.storage.sync.set(propsSaved);
  }
  
  function restoreOptions() {
  
    function setCurrentChoice(result) {
      propertiesConfig.forEach(prop=>{
        document.getElementById(prop.id).value = result[prop.id] || prop.default
      })
    }
  
    function onError(error) {
      console.log(`Error: ${error}`);
    }
  
    let getting = browser.storage.sync.get(null);
    getting.then(setCurrentChoice, onError);
  }
  
document.addEventListener("DOMContentLoaded", restoreOptions);
const content = propertiesConfig.map(prop=>{
  return ` <tr><td><label>${prop.label || prop.id}</label></td>
  <td><input id="${prop.id}" name="${prop.name}"></td></tr>
  `
}).join('')
document.getElementById("props").innerHTML = content

document.querySelector("form").addEventListener("submit", saveOptions);