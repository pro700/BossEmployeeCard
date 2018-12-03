//import { Web, sp } from '@pnp/sp';
//import { setupPnp } from './utils/odata';

//import '!!css-loader?name=../styles/jstree.[ext]!jstree/dist/themes/default/style.css';
//import '!!css-loader?name=../styles/[name].[ext]!bootstrap/dist/css/bootstrap.css';

//import 'jstree/dist/themes/default/style.css';
//import 'bootstrap/dist/css/bootstrap.css';

require('jstree/dist/themes/default/style.css');
require('bootstrap/dist/css/bootstrap.css');

import * as $ from 'jquery';

//import 'jstree';
//setupPnp();
//const container: HTMLElement = document.getElementById('cewp-container');
//var web = new Web(_spPageContextInfo.webAbsoluteUrl);

$( "#cewp-container" ).html(`
  <div class="employee-card">

    <table class="panels">
      <tr>
        <td> <div id="treecontainer"> </div> </td>
        <td> <div id="panecontainer"> </div> </td> 
      </tr>            
    </table>

    <p id="message" style="color:blue;">
    </p>

    <p id="error" style="color:red;">
    </p>

    <div id="alldata" style="display: none;" >
        AllData Loading...
    </div>
    
  </div>`);

$("h1#pageTitle").html("Карточка сотрудника (Бета-тест)");

$( "#alldata" ).load( _spPageContextInfo.webAbsoluteUrl + "/SitePages/KS_Peoples2.aspx #998877", function( response, status, xhr ) {

  var data0: any[] = [];
  
  $('#alldata tr').each( function() {
    var cells = $('td', this);
    var icon = "jstree-icon jstree-folder";
    var type = "department";

    if(cells[3].innerText =="person") { 
      icon="jstree-icon jstree-file"; 
      type="person";
    }

    var id: string = cells[0].innerText;
    var text: string = cells[2].innerText;

    if(false){}
    else if(id == "705") { text = "ИТ Интегратор";  }
    else if(id == "4071"){ text = "Группа компаний Октава"; }
    else if(id == "4072"){ text = "Октава Капитал"; }

    var row = {
      id: id, 
      parent: (cells[1].innerText == "0" ? "#" : cells[1].innerText), 
      text: text, 
      icon: icon, 
      type: type,
      title: cells[4].innerText,
      email: cells[5].innerText,
      birthday: cells[6].innerText,
      workphone: cells[7].innerText,
      WorkType: cells[8].innerText,
      TabNum: cells[9].innerText,
      idFirm: cells[10].innerText,
      FirmName: cells[11].innerText,
      Auto_Card: cells[12].innerText,
      CuratorFullName: cells[13].innerText,
      CuratorAutoCard: cells[14].innerText,
      MobilePhone: cells[15].innerText,
      InternalPhone: cells[16].innerText
    };
    
    data0.push(row);
  });

  // clear alldata
  $( "#alldata" ).html("");

  // Get department path
  var GetDeptPath = function(jstreedata: any, child_node: any, root_node_id?: string) {
    var node: any = child_node;
    var texts: string[] = [];
    while(node && node.parent !== root_node_id && node.parent !== '#') {
      node = jstreedata.instance.get_node(node.parent);
      texts.unshift(node.text);
    }
    return texts.join('. ');
  }

  // Get Employee table
  var GetEmployeeTable = function(jstreedata: any, person_ids: string[], root_node_id?: string, filter?: string) : string {

    var ids: string[] = person_ids.sort(function(id1: string, id2: string) {
      var txt1: string = jstreedata.instance.get_node(id1).text;
      var txt2: string = jstreedata.instance.get_node(id2).text;
      return txt1.localeCompare(txt2);
    });

    if(filter) {
      var exp: any = new RegExp(`${filter}`, 'i');
      ids = ids.filter(function(id: string) {
        var text: string = jstreedata.instance.get_node(id).text;
        var result: boolean = (text.search(exp) >= 0);
        return result;
      });
    }

    return `<table class='table-bordered table-striped employees'>
      ${ ids.map(function(id: string) { 
        var child_node: any = jstreedata.instance.get_node(id);
        if(child_node.icon === "jstree-icon jstree-file") {
          return `<tr> 
                    <td>
                      <img src='${ _spPageContextInfo.webAbsoluteUrl }/SiteAssets/Pictures/ADPhotos/${ child_node.original.email }.jpg' alt='' height='48'/>
                    </td>
                    <td>
                      <a id='${id}' class='employee-link'>${ child_node.text }</a>
                    </td>
                    <td> ${ child_node.original.title }</td>
                    <td> ${ GetDeptPath(jstreedata, child_node, root_node_id) } </td>
                    <td> ${ child_node.original.workphone }</td>
                   </tr>`;
        }
        else { 
          return ``; 
        }
    }).join(``)}
    </table>`;
  };

  // create tree
  var jstree = $('#treecontainer').jstree({ "core" : {
    "plugins": ["changed", "types"],
    "check_callback": true,
    "multiple": false,
    "data": data0
   }});

  jstree.on('changed.jstree', function (e: any, data: any) {
    if(data.action == "select_node"){
      var html:string = ""
      // Get node
      var node: any = data.instance.get_node(data.selected[0]);

      if(node.icon === "jstree-icon jstree-file") {

        var deps: any[] = [];
        var pers_subordinates: string[] = [];
        var deps_subordinates: string[] = [];
        data0.map(row => {
          if(row.Auto_Card == node.original.Auto_Card) {
            //var parent_node = data.instance.get_node(row.parent)
            //deps.push(parent_node.original.text);
            deps.push(GetDeptPath(data, data.instance.get_node(row.id), '56'));
          }
          if(row.CuratorAutoCard == node.original.Auto_Card) {
            if(row.icon === "jstree-icon jstree-file") {
              pers_subordinates.push(row.id);
            }
            else {
              deps_subordinates.push(row.id);
            }
          }
        });

        pers_subordinates = pers_subordinates.sort(function(id1: string, id2: string) {
          var txt1: string = data.instance.get_node(id1).text;
          var txt2: string = data.instance.get_node(id2).text;
          return txt1.localeCompare(txt2);
        });

        deps_subordinates = deps_subordinates.sort(function(id1: string, id2: string) {
          var txt1: string = data.instance.get_node(id1).text;
          var txt2: string = data.instance.get_node(id2).text;
          return txt1.localeCompare(txt2);
        });

        var deps1: any[] = [];
        var parents: string[] = node.parents;
        parents.map(parent => {
          if(parent != "#") {
            var parent_node = data.instance.get_node(parent)
            deps1.push(parent_node.original.text);
          }
        });

        var birthday = new Date(node.original.birthday);
        var birthdaystr : string = birthday.toLocaleDateString('ru', { month: 'long', day: 'numeric' });
        var birthdaystrarr : string[] = birthdaystr.split(" ");
        birthdaystr = birthdaystrarr[0] + ' ' + birthdaystrarr[1];

        html = `
        <table class="panels">
          <tr>
            <td>
              <div class="panel panel-default">
                <div class="panel-body">
                  <img src='${ _spPageContextInfo.webAbsoluteUrl }/SiteAssets/Pictures/ADPhotos/${ node.original.email }.jpg' alt=''/>
                </div>
                <div class="panel-footer name-footer">
                  ${ node.original.text }
                </div>
              </div>          
            </td>
            <td>
              <div class="panel panel-default">
                <div class="panel-heading info-panel-heading"> Контактная информация </div>
                <div class="panel-body">
                  <table class="panels">
                    <tr> <td> Рабочий телефон: </td> <td> ${ node.original.workphone } </td> </tr>
                    <tr> <td> Внутренний телефон: </td> <td>${ node.original.InternalPhone }</td> </tr>
                    <tr> <td> Мобильный телефон: </td> <td>${ node.original.MobilePhone }</td> </tr>
                    <tr> <td> Электронная почта: </td> <td> ${ node.original.email } </td> </tr>
                  </table>
                </div>
              </div>

              <div class="panel panel-default">
                <div class="panel-heading info-panel-heading"> Личная информация </div>
                <div class="panel-body">
                  <table class="panels">
                    <tr> <td> День рождения: </td> <td> ${ birthdaystr } </td> </tr>
                  </table>
                </div>
              </div>
            </td>
          </tr>
        </table>

        <div class="panel panel-default">
          <div class="panel-heading info-panel-heading"> ${ data.instance.get_node(node.original.parent).text } </div>
          <div class="panel-body">
            <table class="panels">
              <tr> <td> Должность: </td> <td> ${ node.original.title } </td> </tr>
              <tr> <td> Подразделения: </td> <td> ${ deps.map(dep => `<span> ${dep} </span>`).join('<br/>') } </td> </tr>
              <tr> <td> Руководитель: </td> <td> ${ node.original.CuratorFullName } </td> </tr>
            </table>
          </div>
        </div>

        <div class="panel panel-default">
          <div class="panel-heading info-panel-heading"> Подчиненные: </div>
          <div class="panel-body">
              <table class='table-bordered table-striped employees'>
              ${ deps_subordinates.map(function(id: string) {
                var child_node: any = data.instance.get_node(id);
                return `<tr> <td> ${ GetDeptPath(data, child_node, '56') + '. ' + child_node.text } </td> </tr>`;
              }).join('')}
            </table>
            <br/>
            ${ GetEmployeeTable(data, pers_subordinates, "56") }
          </div>
        </div>
        `;
      }
      else {
        html = `<div style="width: 400px; margin-bottom: 8px;">
                  <input id="123513451" type="search" class="form-control" placeholder="Поиск">
                </div>
              </div>
              <div id="3454632345">
                ${ GetEmployeeTable(data, node.children_d, node.id) }
              </div>`
      }

      $("#panecontainer").html(html);

      $("a.employee-link").click(function() {
        var node: any = data.instance.get_node($(this).attr('id'));
        data.instance.deselect_all();
        data.instance.close_all();
        data.instance.open_node(node);
        data.instance.select_node(node);
      });

      var search_timeout;
      $('input#123513451').on('input', function() {
        clearTimeout(search_timeout);
        search_timeout = setTimeout( function() {
          var filter = $('input#123513451').val();
          $('div#3454632345').html( GetEmployeeTable(data, node.children_d, node.id, filter) );
          $("a.employee-link").click(function() {
            var node: any = data.instance.get_node($(this).attr('id'));
            data.instance.deselect_all();
            data.instance.close_all();
            data.instance.open_node(node);
            data.instance.select_node(node);
          });
        }, 500);
      });
    }
  });
});


/*

Promise.all([
  sp.web.select('Title').get(),
  sp.web.lists.select('Title').get()
]).then(([web, lists]) => {
  container.innerHTML =
    `<h2>Web title: ${web.Title}</h2>` +
    `<ul>
      ${lists.map(list => `<li>${list.Title}</li>`).join('')}
    </ul>`;
});
*/
