# Import required libraries
import numpy as nm # numpy for performing mathematical calculations
import matplotlib.pyplot as mtp # matplotlib.pyplot for plotting graphs
import pandas as pd # pandas for managing the dataset
from google.cloud import storage # google.cloud storage for getting training and testing dataset
from io import BytesIO # BytesIO for byte manipulation

# Import train CSV file from Google Cloud Storage into dataframe - train_csv_df
train_bucket_name = "traindatab00857606" # Train bucket name
train_csv_file_name = "trainVectors.csv" # Train CSV file name
storage_client = storage.Client() # Google Cloud Storage client instance
train_bucket = storage_client.get_bucket(train_bucket_name) # Train bucket instance
train_csv_file_blob = train_bucket.get_blob(train_csv_file_name) # Train CSV file blob instance
train_csv_file_content = train_csv_file_blob.download_as_bytes() # Train CSV file content instance
train_csv_df = pd.read_csv(BytesIO(train_csv_file_content)) # Train CSV dataframe instance
print(train_csv_df) # Print the content of train_csv_df instance

# Train CSV dataset of only last column (Levenshtein distance last column)
lev_dis_train_ds = train_csv_df.iloc[:, [2]].values
print(lev_dis_train_ds)

# Finding optimal number of clusters using the Elbow method  
from sklearn.cluster import KMeans # Import KMeans algorithm (Clustering algorithm)
wcss_list= []  # Initializing the list for the values of WCSS  

# Using for loop for iterations from [1, 11)
for cluster_num in range(1, 11):  
    kmeans = KMeans(n_clusters=cluster_num, init='k-means++', random_state= 42)  
    kmeans.fit(lev_dis_train_ds)  
    wcss_list.append(kmeans.inertia_) 

# Plot the Elbow graph to decide the value of 'k' in K-means algorithm
mtp.plot(range(1, 11), wcss_list)  
mtp.title('The Elbow Method Graph')  
mtp.xlabel('Number of clusters (k)')  
mtp.ylabel('wcss_list')  
mtp.show()  

# Training the K-means model on a dataset  
kmeans = KMeans(n_clusters=4, init='k-means++', random_state= 42)  
y_train_pred = kmeans.fit_predict(lev_dis_train_ds)  
print(y_train_pred)

# Visulaizing the clusters  
mtp.scatter(lev_dis_train_ds[y_train_pred == 0], lev_dis_train_ds[y_train_pred == 0], s = 50, c = 'red', label = 'Lev dis Cluster 1') # For first cluster  
mtp.scatter(lev_dis_train_ds[y_train_pred == 1], lev_dis_train_ds[y_train_pred == 1], s = 50, c = 'green', label = 'Lev dis Cluster 2') # For second cluster  
mtp.scatter(lev_dis_train_ds[y_train_pred== 2], lev_dis_train_ds[y_train_pred== 2], s = 50, c = 'blue', label = 'Lev dis Cluster 3') # For third cluster  
mtp.scatter(lev_dis_train_ds[y_train_pred == 3], lev_dis_train_ds[y_train_pred == 3], s = 50, c = 'cyan', label = 'Lev dis Cluster 4') # For fourth cluster  
mtp.scatter(kmeans.cluster_centers_[:], kmeans.cluster_centers_[:], s = 150, c = 'yellow', label = 'Centroids')   
mtp.title('Lev Distance Calculation on Train Dataset')  
mtp.xlabel('Lev Distance')  
mtp.ylabel('Lev Distance')  
mtp.legend()
mtp.show()  


# Import test CSV file from Google Cloud Storage into dataframe - test_csv_df
test_bucket_name = "testdatab00857606" # Test bucket name
test_csv_file_name = "testVectors.csv" # Test CSV file name
test_bucket = storage_client.get_bucket(test_bucket_name) # Test bucket instance
test_csv_file_blob = test_bucket.get_blob(test_csv_file_name) # Test CSV file blob instance
test_csv_file_content = test_csv_file_blob.download_as_bytes() # Test CSV file content instance
test_csv_df = pd.read_csv(BytesIO(test_csv_file_content)) # Test CSV dataframe instance
print(test_csv_df) # Print the content of test_csv_df instance

# Test CSV Dataset of only last column (Levenshtein distance last column)
lev_dis_test_ds = test_csv_df.iloc[:, [2]].values
print(lev_dis_test_ds)

# Predict for test dataset
y_test_predict= kmeans.predict(lev_dis_test_ds)  
print(y_test_predict)

# Visulaizing the clusters  
mtp.scatter(lev_dis_test_ds[y_test_predict == 0], lev_dis_test_ds[y_test_predict == 0], s = 50, c = 'red', label = 'Lev dis Cluster 1') # For first cluster  
mtp.scatter(lev_dis_test_ds[y_test_predict == 1], lev_dis_test_ds[y_test_predict == 1], s = 50, c = 'green', label = 'Lev dis Cluster 2') # For second cluster  
mtp.scatter(lev_dis_test_ds[y_test_predict== 2], lev_dis_test_ds[y_test_predict== 2], s = 50, c = 'blue', label = 'Lev dis Cluster 3') # For third cluster  
mtp.scatter(lev_dis_test_ds[y_test_predict == 3], lev_dis_test_ds[y_test_predict == 3], s = 50, c = 'cyan', label = 'Lev dis Cluster 4') # For fourth cluster  
mtp.scatter(kmeans.cluster_centers_[:], kmeans.cluster_centers_[:],s = 150, c = 'yellow', label = 'Centroids')   
mtp.title('Lev Distance Calculation on Test Dataset')  
mtp.xlabel('Lev Distance')  
mtp.ylabel('Lev Distance')  
mtp.legend()
mtp.show()