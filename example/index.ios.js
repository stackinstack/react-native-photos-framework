/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Image } from 'react-native';
import RNPhotosFramework from './react-native-photos-framework';

export default class Example extends Component {

    constructor() {
        super();
        this.state = {
            images: []
        };
    }

    componentDidMount() {
        RNPhotosFramework.requestAuthorization().then((statusObj) => {
            if (statusObj.isAuthorized) {
                RNPhotosFramework.getAlbums({
                    type: 'smartAlbum',
                    subType: 'smartAlbumUserLibrary',
                    assetCount: 'exact',
                    fetchOptions: {
                        sortDescriptors: [
                            {
                                key: 'title',
                                ascending: true
                            }
                        ],
                        includeHiddenAssets: false,
                        includeAllBurstAssets: false
                    },
                    //When you say 'trackInsertsAndDeletes or trackChanges' for an albums query result,
                    //They will be cached and tracking will start.
                    //Call queryResult.stopTracking() to stop this. ex. on componentDidUnmount
                    trackInsertsAndDeletes: true,
                    trackChanges: false

                }).then((queryResult) => {
                    const album = queryResult.albums[0];
                    return album.getAssets({
                        fetchOptions : {
                            mediaTypes: ['video']
                        },

                        //The fetch-options from the outer query will apply here, if we get
                        startIndex: 0,
                        endIndex: 10,
                        //When you say 'trackInsertsAndDeletes or trackAssetsChange' for an albums assets,
                        //They will be cached and tracking will start.
                        //Call album.stopTracking() to stop this. ex. on componentDidUnmount
                        trackInsertsAndDeletes: true,
                        trackChanges: false
                    }).then((response) => {
                        const asset = response.assets[0];
                        setTimeout(() => {
                            asset.postAsset();

                        }, 5000);
                        this.setState({
                            images: [response.assets[0]]
                        });
                    });
                });
            }
        });
    }

    renderImage(asset, index) {
        return (
            <Image key={index} source={asset.image} style={{ width: 100, height: 100 }}></Image>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.images.map(this.renderImage.bind(this))}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5
    }
});

AppRegistry.registerComponent('Example', () => Example);