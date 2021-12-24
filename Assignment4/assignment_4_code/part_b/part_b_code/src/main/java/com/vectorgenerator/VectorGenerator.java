package com.vectorgenerator;

import com.google.cloud.functions.BackgroundFunction;
import com.google.cloud.functions.Context;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.BucketInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

import java.util.logging.Logger;

import com.google.cloud.storage.Blob;
import com.google.api.gax.paging.Page;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * {@code VectorGenerator} class contains the implementation for the generateVector Google Cloud Function.
 * {@code VectorGenerator} class implementation works for both training dataset and testing dataset.
 * <p>
 * While working with training dataset, comment variables {@code TEST_VECTOR_CSV} and {@code TEST_DATA_BUCKET}
 * and use variables {@code TRAIN_VECTOR_CSV} and {@code TRAIN_DATA_BUCKET}.
 * <p>
 * While working with test dataset, comment variables {@code TRAIN_VECTOR_CSV} and {@code TRAIN_DATA_BUCKET}
 * and use variables {@code TEST_VECTOR_CSV} and {@code TEST_DATA_BUCKET}.
 * <p>
 * The working of {@code VectorGenerator} class is as below:
 * <p>
 * Step 1: Stop
 * <p>
 * Step 2: Read all the files (either training dataset files or test dataset files) uploaded to the bucket one at a time.
 * Each file is read as a blob (i.e. {@code Blob blob})
 * <p>
 * Step 3: For each file, first read the file content as {@code String fileContent} and filter out the special characters,
 * extra spaces and line breaks using regex.
 * <p>
 * Step 4: Split the file content from {@code String fileContent} into list of words (i.e., {@code List<String>} wordsList)
 * and remove all stop words from the list (i.e., remove all words matching in list {@code List<String> STOP_WORDS_LIST}).
 * <p>
 * Step 5: Calculate Levenshtein distance for the list of words by iterating the {@code List<String> wordsList}.
 * Levenshtein distance is calculated for the current word and next word and the calculated output is stored inside
 * {@code List<String[]> dataLinesList} with each {@code String[]} containing current word at 0th index, next word
 * at 1st index and Levenshtein distance between the current word and the next word at 3rd index.
 * <p>
 * Step 6: After all files are processed, convert {@code List<String> wordsList} into {@code String} with content as
 * {@code current_word_1,next_word_1,lev_distance_1\ncurrent_word_1,next_word_1,lev_distance_1} and is store it in
 * {@code StringBuilder dataLinesStringBuilder}.
 * <p>
 * Step 7: Convert the {@code StringBuilder dataLinesStringBuilder} into {@code String} and store it in a CSV file
 * and upload it to the bucket.
 * <p>
 * - For train dataset, store the {@code String} content in {@code TRAIN_VECTOR_CSV} and upload it
 * to {@code TRAIN_DATA_BUCKET}.
 * - For test dataset, store the {@code String} content in {@code TEST_VECTOR_CSV} and upload it
 * to {@code TEST_DATA_BUCKET}.
 * <p>
 * Levenshtein distance calculation code reference
 * https://www.baeldung.com/java-levenshtein-distance
 * <p>
 * Stop Words List Reference
 * https://gist.github.com/sebleier/554280
 * <p>
 * Convert to code CSV reference
 * https://www.baeldung.com/java-csv
 *
 * @author Dhrumil Amish Shah (B00857606|dh416386@dal.ca)
 */
public final class VectorGenerator implements BackgroundFunction<VectorGenerator.GCSEvent> {
  private static final Logger LOGGER;
  private static final List<String> STOP_WORDS_LIST;
  // private static final String TRAIN_VECTOR_CSV;
  // private static final String TRAIN_DATA_BUCKET;
  private static final String TEST_VECTOR_CSV;
  private static final String TEST_DATA_BUCKET;

  static {
    LOGGER = Logger.getLogger(VectorGenerator.class.getName());
    // Reference: https://gist.github.com/sebleier/554280
    STOP_WORDS_LIST = Arrays.asList("i", "me", "my",
        "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself",
        "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself",
        "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what",
        "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are",
        "was", "were", "be", "been", "being", "have", "has", "had", "having", "do",
        "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because",
        "as", "until", "while", "of", "at", "by", "for", "with", "about", "against",
        "between", "into", "through", "during", "before", "after", "above", "below",
        "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again",
        "further", "then", "once", "here", "there", "when", "where", "why", "how", "all",
        "any", "both", "each", "few", "more", "most", "other", "some", "such", "no",
        "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t",
        "can", "will", "just", "don", "should", "now");
    // TRAIN_VECTOR_CSV = "trainVectors.csv";
    // TRAIN_DATA_BUCKET = "traindatab00857606";
    TEST_VECTOR_CSV = "testVectors.csv";
    TEST_DATA_BUCKET = "testdatab00857606";
  }

  @Override
  public void accept(final GCSEvent event, final Context context) {
    LOGGER.info("com.vectorgenerator.VectorGenerator:  Event name: " + event.name);
    LOGGER.info("com.vectorgenerator.VectorGenerator:  Bucket name: " + event.bucket);

    final Storage storage = StorageOptions.getDefaultInstance().getService();
    final Page<Blob> blobs = storage.get(event.bucket).list();

    final List<String[]> dataLinesList = new ArrayList<>();
    for (final Blob blob : blobs.iterateAll()) {
      LOGGER.info("com.vectorgenerator.VectorGenerator:  Blob name: " + blob.getName());
      final String generalRegex = "[,.\\-_'\"(){}?!@#$%^&*\\[\\]]+";
      final String spaceRegex = "[\\n\\r\\t]+";
      final String fileContent = new String(blob.getContent())
          .replaceAll(generalRegex, "")
          .replaceAll(spaceRegex, " ");
      final List<String> wordsList = new ArrayList<>(Arrays.asList(fileContent.toLowerCase().split(" ")));
      wordsList.removeAll(STOP_WORDS_LIST);

      LOGGER.info("com.vectorgenerator.VectorGenerator:  List of words after removing stop words.");
      final StringBuilder wordsListBuilder = new StringBuilder();
      for (final String word : wordsList) {
        wordsListBuilder.append(word).append(" ");
      }
      LOGGER.info("com.vectorgenerator.VectorGenerator: " + wordsListBuilder.toString());

      for (int i = 0; i < wordsList.size() - 1; i++) {
        final String currentWord = wordsList.get(i);
        final String nextWord = wordsList.get(i + 1);
        final int distance = calculate(currentWord, nextWord);
        dataLinesList.add(new String[]{currentWord, nextWord, String.valueOf(distance)});
      }
    }

    final StringBuilder dataLinesStringBuilder = new StringBuilder();
    for (final String[] dataLine : dataLinesList) {
      dataLinesStringBuilder.append(convertToCSV(dataLine)).append("\n");
    }

    uploadCSVFileToGCSBucket(dataLinesStringBuilder.toString(), storage);
  }

  /**
   * Reference: https://www.baeldung.com/java-levenshtein-distance
   */
  private int costOfSubstitution(final char a, final char b) {
    return a == b ? 0 : 1;
  }

  /**
   * Reference: https://www.baeldung.com/java-levenshtein-distance
   */
  private int min(final int... numbers) {
    return Arrays.stream(numbers).min().orElse(Integer.MAX_VALUE);
  }

  /**
   * Reference: https://www.baeldung.com/java-csv
   */
  private int calculate(final String x, final String y) {
    final int[][] dp = new int[x.length() + 1][y.length() + 1];
    for (int i = 0; i <= x.length(); i++) {
      for (int j = 0; j <= y.length(); j++) {
        if (i == 0) {
          dp[i][j] = j;
        } else if (j == 0) {
          dp[i][j] = i;
        } else {
          dp[i][j] = min(dp[i - 1][j - 1] +
                  costOfSubstitution(x.charAt(i - 1), y.charAt(j - 1)),
              dp[i - 1][j] + 1,
              dp[i][j - 1] + 1);
        }
      }
    }
    return dp[x.length()][y.length()];
  }

  /**
   * Reference: https://www.baeldung.com/java-csv
   */
  private String escapeSpecialCharacters(String data) {
    String escapedData = data.replaceAll("\\R", " ");
    if (data.contains(",") || data.contains("\"") || data.contains("'")) {
      data = data.replace("\"", "\"\"");
      escapedData = "\"" + data + "\"";
    }
    return escapedData;
  }

  /**
   * Reference: https://www.baeldung.com/java-levenshtein-distance
   */
  private String convertToCSV(String[] dataLine) {
    return Stream.of(dataLine)
        .map(this::escapeSpecialCharacters)
        .collect(Collectors.joining(","));
  }

  private void uploadCSVFileToGCSBucket(final String csvFileContent, final Storage storage) {
    if (storage.get(TEST_DATA_BUCKET) == null) {
      storage.create(BucketInfo.of(TEST_DATA_BUCKET));
      LOGGER.info("com.vectorgenerator.VectorGenerator: " + "Bucket " + TEST_DATA_BUCKET + " created successfully.");
    } else if (!storage.get(TEST_DATA_BUCKET).exists()) {
      storage.create(BucketInfo.of(TEST_DATA_BUCKET));
      LOGGER.info("com.vectorgenerator.VectorGenerator: " + "Bucket " + TEST_DATA_BUCKET + " created successfully.");
    } else {
      LOGGER.info("com.vectorgenerator.VectorGenerator: " + "Bucket " + TEST_DATA_BUCKET + " exists already.");
    }
    final BlobInfo blobInfo = BlobInfo.newBuilder(BlobId.of(TEST_DATA_BUCKET, TEST_VECTOR_CSV)).build();
    storage.create(blobInfo, csvFileContent.getBytes());
    LOGGER.info("com.vectorgenerator.VectorGenerator: File " + TEST_VECTOR_CSV + " uploaded to bucket " + TEST_DATA_BUCKET + ".");
  }

  public static class GCSEvent {
    final String bucket;
    final String name;
    final String metaGeneration;

    public GCSEvent(final String bucket,
                    final String name,
                    final String metaGeneration) {
      this.bucket = bucket;
      this.name = name;
      this.metaGeneration = metaGeneration;
    }
  }
}