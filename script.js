import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import {cargarModelo} from './CargarModelo.js';
import {Particula} from './Particula.js';


var particulas = [];
var panuelo = new THREE.Object3D();
var cant = 10;
var radio = 70;
var lista = [
    {lt:-34.915284,lg:-57.947845},
    {lt:-34.9209,lg:-57.9415}
];
var poss = [
  new THREE.Vector2(0, 0),
  new THREE.Vector2(105, 0),
  new THREE.Vector2(-105, 0),
  new THREE.Vector2(0, -105),
  new THREE.Vector2(0, 105)
];

var escena = document.querySelector('a-scene');
var punto = document.createElement('a-entity');//document.getElementById('plaza');
punto.setAttribute('id','punto'+1);
punto.setAttribute('gps-entity-place', `latitude: ${lista[0].lt}; longitude: ${lista[0].lg};`);
escena.appendChild(punto);
//cargarModelo('./modelo/panredu.glb',modelo[i]);
//modelo[i].scale.set(15,15,15);
escena.appendChild(punto);

cargarModelo('./modelo/panredu2.glb',panuelo);
panuelo.scale.set(15,15,15);

var objeto = new THREE.Object3D();
const luz1 = new THREE.PointLight( 0xffffff, 2, 100 );
luz1.position.set(0,50,0);
objeto.add( luz1 );
//let ambiental = new THREE.AmbientLight( 0x404040 ); // soft white light
//objeto.add( ambiental );
for (let i=0; i<cant; i++) {
  particulas[i] = new Particula();
  objeto.add(particulas[i].modelo);
}
punto.object3D.add( objeto );

function animar(){
    requestAnimationFrame(animar);
    if(panuelo.children.length > 0){
        for (let i=0; i<cant; i++) {
            if(particulas[i].sinModelo){
                particulas[i].modelo.add(panuelo.clone());
                particulas[i].sinModelo = false;
            }
        }
    }
    mover();
}

animar();


function mover() {
  for (let i=0; i<cant; i++) {
    let acc =  particulas[i].alejar(poss[0], 70);
    let acc2 =  particulas[i].acercar(poss[0], 140);
    particulas[i].vel.add(acc);
    particulas[i].vel.add(acc2);
    for (let j=0; j<cant; j++) {
      if (i!=j) {
        let acc3 =  particulas[i].alejar(particulas[j].pos, 15);
        particulas[i].vel.add(acc3);
      }
    }
    for (let j=0; j<4; j++) {
      let acc3 =  particulas[i].alejar(poss[j+1], radio*0.5);
      particulas[i].vel.add(acc3);
  }
    particulas[i].vel.clampLength(-particulas[i].velMax,particulas[i].velMax);
    particulas[i].pos.add(particulas[i].vel);
    particulas[i].actualizar();
  }
}
