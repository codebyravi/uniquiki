import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MapService {
  private map: google.maps.Map;
  private markers: google.maps.Marker[] = [];

  // Creates a new map inside of the given HTML container.
  public initMap(el: HTMLElement, mapOptions: any): void {
    this.map = new google.maps.Map(el, mapOptions);
    this.resize();
    // Adds event listener resize when the window changes size.
    google.maps.event.addDomListener(window, 'resize', () => this.resize());
  }

  public setCenter(latLng: google.maps.LatLng): void {
    if (this.map === null || this.map === undefined || latLng === null) {
      return;
    }

    this.map.panTo(latLng);
  }

  public setZoom(zoom: number): void {
    if (this.map === null || this.map === undefined) {
      return;
    }

    this.map.setZoom(zoom);
  }

  public addMarker(
    latLng: google.maps.LatLng,
    title?: string,
    contentString?: string
  ): void {
    if (this.map != null && latLng != null) {
      // Creates the marker.
      const marker: google.maps.Marker = new google.maps.Marker({
        position: latLng,
        title
      });
      // Adds the marker to the map.
      marker.setMap(this.map);
      // Creates the info window if required.
      if (contentString != null) {
        // Sets the max width of the info window to the width of the map element.
        const width: number = this.map.getDiv().clientWidth;
        const infoWindow: google.maps.InfoWindow = new google.maps.InfoWindow({
          content: contentString,
          maxWidth: width
        });
        // Makes the info window visible.
        marker.addListener('click', () => {
          infoWindow.open(this.map, marker);
        });
      }

      // Pushes it to the markers array.
      this.markers.push(marker);
    }
  }

  public deleteMarkers(): void {
    // Removes the markers from the map.
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    // Removes references to them.
    this.markers = [];
  }

  public resize(): void {
    // Saves the center.
    const latLng: google.maps.LatLng = this.map.getCenter();
    // Triggers resize event.
    setTimeout(() => {
      google.maps.event.trigger(this.map, 'resize');
      // Restores the center.
      this.map.setCenter(latLng);
    });
  }
}
