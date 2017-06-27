var production = {
  profnastil: {
    name: 'Профнастил',
    options: ['Профнастил с8 1150 (1200)', 'Профнастил с20 1100 (1150)', 'Профнастил с21 1000 (1050)'],
    width: [1150, 1100, 1000],
    price: {
      zn: [215, 245, 255, 265],
      polymer: [240, 280, 310, 330],
      doublePolymer: [, 310],
      steelArt: [, , 430, 460],
      steelArt_3D: [, , 445, 475]
    },
    getCountByIndex: function (index) {
      return Math.ceil(currentValues.length * 1000 / this.width[index]) || 0;
    }
  },
  euroshtaket: {
    name: 'Евроштакетник',
    options: ['Евроштакетник П-профиль прямой', 'Евроштакетник П-профиль фигурный', 'Евроштакетник М-профиль прямой', 'Евроштакетник М-профиль фигурный'],
    price: {
      zn: [, 45],
      polymer: [, 55],
      doublePolymer: [, 65],
      steelArt: [, , 110],
      steelArt_3D: [, , 120]
    },
    getCount: function () {
      var perMeter = Math.ceil(100 / (11 + currentValues.gap));
      if (currentValues.isDoublePicketFence) {
        perMeter = perMeter * 2 - 1;
      }
      return Math.ceil(currentValues.length * perMeter) || 0;
    }
  },
  tubes: {
    name: 'Профильная труба',
    options: ['Профильная труба 40х20х1.5, 6 метровая (Лаги)', 'Профильная труба 60х60х2, 6 метровая (Столбы)'],
    price: {
      t40x20: 88,
      t60x60: 188
    },
    getCounts: function () {
      var t40x20 = Math.ceil(currentValues.logs * currentValues.length / 6);
      var t60x60 = Math.ceil(currentValues.length / currentValues.posts);
      t60x60 = (currentValues.height < 2.5) ? (t60x60 * 0.5) : t60x60;

      return [t40x20, t60x60];
    },
    getMeters: function () {
      var t40x20 = this.getCounts()[0] * 6;

      var t60x60 = this.getCounts()[1] * 6;

      return [t40x20, t60x60];
    },
    getPrices: function () {
      return [this.price.t40x20, this.price.t60x60];
    }
  }
}

var thinknessArray = [0.35, 0.40, 0.45, 0.50];

var currentValues = {
  length: 0,
  color: '',
  colorName: '',
  height: 0,
  thinkness: 0,
  logs: 0,
  posts: 0,
  gap: 0,
  isDoublePicketFence: false,
  fillBaseValues: function () {
    document.querySelectorAll('label').forEach(function (item) {
      item.classList.remove('checked');
    });
    document.querySelectorAll('input:checked').forEach(function (item) {
      item.parentNode.classList.add('checked');
    });
    this.length = inputFields.getLength();
    this.height = inputFields.getHeight();
    this.color = inputFields.getColor();
    this.colorName = inputFields.getColorOption();
    this.thinkness = inputFields.getThinkness();
    this.logs = inputFields.getLogs();
    this.posts = inputFields.getPosts();
    this.gap = inputFields.getGap();
    this.isDoublePicketFence = inputFields.isDoublePicketFence();
  },
  getPrice: function (productName) {
    if (!productName) return 0;

    var tIndex = thinknessArray.indexOf(this.thinkness);
    var priceArrayByColor = production[productName].price[this.color];

    return (tIndex > 0 && priceArrayByColor) ? (priceArrayByColor[tIndex] || 0) : 0;
  },
  getProfnastilPrice: function () {
    return this.getPrice('profnastil');
  },
  getStaketPrice: function () {
    return this.getPrice('euroshtaket');
  },
  getValidThinkness: function () {
    var t = thinknessArray[0];

    for (var i = 0; i < thinknessArray.length; i++) {
      var profPrices = production.profnastil.price[this.color];
      var shtPrices = production.euroshtaket.price[this.color];
      t = thinknessArray[i];

      if (profPrices[i] && shtPrices[i]) {
        return t;
      }
    }

    return t;
  },
  getMaterial: function () {
    return colors.textNames[this.color] + '<br> ' + this.colorName.replace('<br>', ' ') + '<br>Толщина: ' + this.thinkness + ' мм.';
  },
  checkPrices: function () {
    return this.getProfnastilPrice() && this.getStaketPrice();
  }
}

var inputFields = {
  length: document.getElementById('calc_input_length'),
  height: document.getElementById('calc_input_height'),
  colorGroup: document.getElementById('calc_fieldset_color'),
  colorOption: document.getElementById('calc_fieldset_color').querySelector('input:checked'),
  thinknessGroup: document.getElementById('calc_fieldset_thinkness'),
  logs: document.getElementById('calc_input_logs'),
  posts: document.getElementById('calc_input_posts'),
  gap: document.getElementById('calc_input_gap'),
  doublePicketFenceField: document.getElementById('calc_input_double_picket_fence'),
  getLength: function () {
    return +this.length.value;
  },
  getHeight: function () {
    return +this.height.value;
  },
  getColor: function () {
    var v = this.colorGroup.querySelector('input:checked').value;
    return v.replace(/ \|\| .*/, '');
  },
  getColorOption: function () {
    var v = this.colorGroup.querySelector('input:checked').value;
    return v.replace(/^.*\|\| /, '');
  },
  getThinkness: function () {
    return +this.thinknessGroup.querySelector('input:checked').value;
  },
  getLogs: function () {
    return +this.logs.value;
  },
  getPosts: function () {
    return +this.posts.value;
  },
  getGap: function () {
    return +this.gap.value;
  },
  isDoublePicketFence: function () {
    return this.doublePicketFenceField.checked;
  },
  setCurrentThinkness: function (t) {
    document.querySelector('input[value="' + t + '"]').checked = 'true';
  },
  setValidThinkness: function () {
    var t = currentValues.getValidThinkness();
    this.setCurrentThinkness(t);
  },
  setCurrentColor: function (color, option) {
     document.querySelector('#' + color + ' label:nth-of-type(' + option + ') input').checked = 'true';
  }
}

var colors = {
  textNames: {
    zn: 'Оцинкованный лист',
    polymer: 'Полимерное покрытие полиэстер (RAL/грунт)',
    doublePolymer: 'Полимерное покрытие полиэстер,<br>окрашенный с двух сторон (RAL/RAL)',
    steelArt: 'Полимерное покрытие премиум класса SteelArt (Стил Арт)',
    steelArt_3D: 'Полимерное покрытие премиум класса SteelArt 3D (Стил Арт 3Д)'
  },
  styles: {
    zn: ['#ccc'],
    polymer: ['#dfcea1 linear-gradient(154deg, #fdecbf, #dfcea1 50%, rgb(158, 160, 161) 50%, rgb(158, 160, 161))',
              '#5e2028 linear-gradient(154deg, #7c3e46, #5e2028 50%, rgb(158, 160, 161) 50%, rgb(158, 160, 161))', 
              '#154889 linear-gradient(154deg, #3366a7, #154889 50%, rgb(158, 160, 161) 50%, rgb(158, 160, 161))', 
              '#0f4336 linear-gradient(154deg, #2d6154, #0f4336 50%, rgb(158, 160, 161) 50%, rgb(158, 160, 161))',
              '#9ea0a1 linear-gradient(154deg, #b2b4b5, #9ea0a1 50%, rgb(158, 160, 161) 50%, rgb(158, 160, 161))',
              '#44322d linear-gradient(154deg, #62504b, #44322d 50%, rgb(158, 160, 161) 50%, rgb(158, 160, 161))',
              '#f4f8f4'],
    doublePolymer: ['#5e2028 linear-gradient(154deg, #7c3e46, #5e2028)',
                    '#0f4336 linear-gradient(154deg, #2d6154, #0f4336)',
                    '#44322d linear-gradient(154deg, #62504b, #44322d)'],
    steelArt: ['url("/sites/default/files/catalog-pictures/oak_marked.png")','#DFC583','#A6A7A1','url("/sites/default/files/catalog-pictures/stone_marked.png")','url("/sites/default/files/catalog-pictures/mil_marked.png")'],
    steelArt_3D: ['#7E5022', 'url("/sites/default/files/catalog-pictures/gold_marked.png")', 'url("/sites/default/files/catalog-pictures/slate_3d_marked.png")', '#997655']
  },
  zn: ['Оцинковка'],
  polymer: ['Бежевый<br>(RAL1014)', 'Темно красный<br>(RAL3005)', 'Синий<br>(RAL5005)', 'Зеленый<br>(RAL6005)', 'Серый<br>(RAL7004)', 'Коричневый<br>(RAL8017)', 'Белый<br>(RAL9003)'],
  doublePolymer: ['Темно красный<br>(RAL3005)', 'Зеленый<br>(RAL6005)', 'Коричневый<br>(RAL8017)'],
  steelArt: ['Дуб', 'Золотой орех', 'Сланец', 'Камень', 'Милитари'],
  steelArt_3D: ['Дуб 3D', 'Золотой орех 3D', 'Сланец 3D', 'Камень 3D']
}

function fillResultTable() {
  var resultTable = document.getElementById('calc_results_table');
  var resultTable = resultTable.querySelector('tbody') || resultTable;
  var resultMaterial = document.getElementById('calc_results_material');
  resultMaterial.innerHTML = currentValues.getMaterial();

  var profnastilPrice = currentValues.getProfnastilPrice();
  var shtaketPrice = currentValues.getStaketPrice();

  resultTable.querySelectorAll('.createdResultTableRow').forEach(function (item) {
    resultTable.removeChild(item);
  });

  addProfn();
  addFreeSpace();
  addSht();
  addFreeSpace();
  addTubes();

  function addProfn() {
    production.profnastil.options.forEach(function (item, index) {
      var productCount = production.profnastil.getCountByIndex(index);
      var totalCount = productCount * currentValues.height;
      var sum = totalCount * profnastilPrice;

      createResultTableRow(item, productCount, totalCount, profnastilPrice, sum);
    });
  }

  function addSht() {
    production.euroshtaket.options.forEach(function (item, index) {
      var productCount = production.euroshtaket.getCount(index);
      var totalCount = productCount * currentValues.height;
      var sum = totalCount * shtaketPrice;
      createResultTableRow((currentValues.isDoublePicketFence) ? item + ' "Шахматка"' : item, productCount, totalCount, shtaketPrice, sum);
    });
  }

  function addTubes() {
    var counts = production.tubes.getCounts();
    var meters = production.tubes.getMeters();
    var prices = production.tubes.getPrices();

    production.tubes.options.forEach(function (item, index) {
      createResultTableRow(item, counts[index], meters[index], prices[index], meters[index] * prices[index]);
    });
  }

  function addFreeSpace() {
    var freeSpaceTr = resultTable.insertRow();
    var freeSpaceTd = freeSpaceTr.insertCell();

    freeSpaceTr.classList.add('createdResultTableRow');
    freeSpaceTd.colSpan = 5;
    freeSpaceTd.innerHTML = ' - - - ';
    freeSpaceTd.style['text-align'] = 'center';
  }

  function createResultTableRow(productName, productNumberPieces, productNumberMeters, productPrice, productSum) {
    var tr = resultTable.insertRow();
    tr.classList.add('createdResultTableRow');

    for (var i = 0; i < arguments.length; i++) {
      var td = tr.insertCell();
      td.innerHTML = arguments[i];
    }
    return tr;
  }
}

function init() {

  var calcBlock = document.querySelector('#calc');
  calcBlock.style['display'] = 'block';

  createColors();

  createLabelsInFieldSet('calc_fieldset_thinkness', 'calc_thinkness', thinknessArray);
  inputFields.setCurrentThinkness(0.4);

  document.addEventListener('input', function (event) {
    currentValues.fillBaseValues();

    if ((event.target.name === 'calc_color') && (!currentValues.checkPrices())) {
      inputFields.setValidThinkness();
      currentValues.fillBaseValues();
    };
    fillResultTable();
  });

  currentValues.fillBaseValues();
  fillResultTable();

  function createLabelsInFieldSet(fieldsetID, radioGroupName, valuesArray) {
    var fieldset = document.getElementById(fieldsetID);
    var label = createRadioLabel();

    if (!label) return;

    valuesArray.forEach(function (item) {
      var newNode = label.cloneNode(true);
      var inputField = newNode.querySelector('input');
      var text = newNode.querySelector('span');

      inputField.value = item;
      inputField.name = radioGroupName;

      text.innerHTML = item;
      fieldset.appendChild(newNode);
    });
  }

  function createColors() {
    var fieldsetColor = document.getElementById('calc_fieldset_color');

    for (var key in colors) {
      if (key === 'textNames' || key === 'styles') continue;
      var colorGroup = document.createElement('div');
      colorGroup.id = key;

      var colorsArray = colors[key];
      if (!colorsArray) continue;

      var colorGroupTitle = document.createElement('h4');
      colorGroupTitle.style['margin-bottom'] = '20px';
      colorGroupTitle.innerHTML = colors.textNames[key];
      colorGroup.appendChild(colorGroupTitle);

      colorsArray.forEach(function (item, index, arr) {

          var label = document.createElement('label');
          var colorDiv = document.createElement('div');
          
          colorDiv.style['background'] = colors.styles[key][index];
          colorDiv.style['background-size'] = 'cover';
          colorDiv.style['margin-bottom'] = '20px';
          colorDiv.style['width'] = '200px';
          colorDiv.style['height'] = '100px';

          var inputField = document.createElement('input');
          inputField.type = 'radio';
          inputField.name = 'calc_color';

        inputField.value = key + ' || ' + item;

        var text = document.createElement('span');
        text.innerHTML = item;

        label.appendChild(colorDiv);
        label.appendChild(inputField);
        label.appendChild(text);

        colorGroup.appendChild(label);
      });

      fieldsetColor.appendChild(colorGroup);
    }
    inputFields.setCurrentColor('polymer', 2);
  }

  function createColorLabel() {
    var l = document.createElement('label');
    l.innerHTML = '<img src="http://placehold.it/200x100"><input type="radio" name="calc_color" value=""><span>Цвет</span>';
    return l;
  }
  function createRadioLabel() {
    var l = document.createElement('label');
    l.innerHTML = '<input type="radio"><span>Текст</span>';
    return l;
  }
  function createLabelFromTemplate(templateName) {
    var template = document.getElementById(templateName);
    if (!template) return undefined;

    var container = 'content' in template ? template.content : template;
    return container.querySelector('label');
  }
}

init();
