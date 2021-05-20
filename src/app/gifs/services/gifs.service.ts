import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey     : string = 'Fx7I1LMHl64xKIksTIPo9whu7qXEMAWz';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  private _historial : string[] = [];

  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial];
  }

  constructor( private http: HttpClient ) {

    this._historial = JSON.parse( localStorage.getItem('historial')! ) || [];

    this.resultados = JSON.parse( localStorage.getItem('resultados')! ) || [];

    //Otra forma de hacerlo
    // if ( localStorage.getItem('historial') ) {
    //   this._historial = JSON.parse( localStorage.getItem('historial')! );
    // }

  }

buscarGifs ( query: string = '' ) {

    query = query.trim().toLocaleLowerCase();

    // Si la busqueda ya se encontraba en el arreglo entonces no agregarla
    // Si no se agrego nada entonces no hay necesidad de hacer el corte de mis primeros 10
    if ( !this._historial.includes( query ) ) {
      //Agregar mi query al inicio del arreglo
      this._historial.unshift( query );
      
      //Cortar solo los primeros 10 elementos del arreglo de busqueda
      this._historial = this._historial.splice(0, 10);

      localStorage.setItem('historial', JSON.stringify( this._historial ) );
    }


    const params = new HttpParams()
          .set('api_key', this.apiKey)
          .set('limit', '10')
          .set('q', query);


    this.http.get<SearchGifsResponse>(`${ this.servicioUrl }/search`, { params })
      .subscribe( resp => {
          this.resultados = resp.data;
          localStorage.setItem('resultados', JSON.stringify( this.resultados ) );
      } );

    //Con fetch
    // ocupamos agregar el async al meotdo async 
    // const resp = await fetch('https://api.giphy.com/v1/gifs/search?api_key=Fx7I1LMHl64xKIksTIPo9whu7qXEMAWz&q=one punch man&limit=10');
    // const data = await resp.json();
    // console.log(data); 

  }

}
