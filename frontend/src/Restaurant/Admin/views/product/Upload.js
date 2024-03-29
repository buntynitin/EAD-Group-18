import React, { useState } from 'react';
import { Button, Grid, Paper } from '@material-ui/core'
import BackupIcon from '@material-ui/icons/Backup';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
const axios = require('axios').default;


function Upload(props) {
    const [fileInputState, setFileInputState] = useState('');
    const [previewSource, setPreviewSource] = useState('');
    const [selectedFile, setSelectedFile] = useState();
    const [successMsg, setSuccessMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [isloading, setIsLoading] = useState('none')

    const handleFileInputChange = (e) => {

        const file = e.target.files[0];
        previewFile(file);
        setSelectedFile(file);
        setFileInputState(e.target.value);
    };



    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result);
        };
    };

    const handleSubmitFile = (e) => {
        e.preventDefault();

        if (!selectedFile) return;
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = () => {
            setIsLoading('block')
            uploadImage(reader.result);

        };
        reader.onerror = () => {
            setErrMsg('something went wrong!');
        };
    };

    const uploadImage = async (base64EncodedImage) => {

        axios.post('http://192.168.29.82:3001/api/restaurant/uploadFood', { data: base64EncodedImage })
            .then(function (response) {
                setErrMsg('');
                props.setimage(response.data.url);
                setFileInputState('');
                setPreviewSource('');
                setIsLoading('none')
                setSuccessMsg('Image uploaded');

            })
            .catch(function (error) {
                setIsLoading('none')
                setErrMsg('Something went wrong!');
                props.setimage('');
            });

    };
    return (
        <div>

            {errMsg && (
                <Alert severity="error">{errMsg}</Alert>
            )}

            {successMsg && (
                <Alert severity="success">{successMsg}</Alert>
            )}


            <input
                id="contained-button-file"
                type="file"
                name="image"
                onChange={handleFileInputChange}
                value={fileInputState}
                className="form-input"
                style={{ display: 'none' }}

            />
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid item><LinearProgress style={{ display: isloading }} /></Grid>

                </Grid>
                <Grid item xs={6}>

                    <label htmlFor="contained-button-file">
                        <Button variant="outlined" fullWidth color="default" component="span">
                            <AttachFileIcon />&nbsp;&nbsp;Select
                   </Button>
                    </label>
                </Grid>
                <Grid item xs={6}>
                    <Button variant="outlined" fullWidth onClick={handleSubmitFile} color="primary" className="btn" type="submit">
                        <BackupIcon />&nbsp;&nbsp;Upload
                </Button>
                </Grid>
            </Grid>
            { "\n"}



            {
                previewSource && (

                    <Paper style={{ marginTop: "25px" }}>
                        <center><img
                            src={previewSource}
                            alt="chosen"
                            style={{ height: '100px', width: '100px' }}
                        /></center>
                    </Paper>

                )
            }
        </div >
    );
}

export default Upload