export const detectGCS = (image1, image2) => {
    // Imports the Google Cloud client libraries
    const vision = require('@google-cloud/vision');
    // Creates a client
    const client = new vision.ImageAnnotatorClient();
    /**
     * TODO(developer): Uncomment the following lines before running the sample.
     */
    const bucketName = 'image_upload_user';
    const fileName = image1;
    const bucketName1 = 'image_upload_when_sending_message';
    const fileName1 = image2;
    var arr1 = [];
    var arr2 = [];
    // Performs label detection on the gcs file1
    const [result] = await client.labelDetection(
        `gs://${bucketName}/${fileName}`
    );
    const labels = result.labelAnnotations;
    console.log('Labels:');
    labels.forEach(label => {
        console.log(label.description);
        arr1.push(label.description);
    }
    );
    // Performs label detection on the gcs file2
    const [result1] = await client.labelDetection(
        `gs://${bucketName1}/${fileName1}`
    );
    const labels1 = result1.labelAnnotations;
    console.log('Labels:');
    labels1.forEach(label => {
        console.log(label.description);
        arr2.push(label.description);
    }
    );
    // console.log(arr1);
    // console.log(arr2);
    if (arrayEquals(arr1, arr2)) {
        return true;
    } else {
        return false;
    }
}

function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

detectGCS();