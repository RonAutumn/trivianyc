import com.mongodb.client.*;
import com.mongodb.MongoClientSettings;
import com.mongodb.ConnectionString;
import org.bson.Document;
import java.util.Date;
import java.util.Calendar;

public class SetupCodes {
    public static void main(String[] args) {
        try {
            // Connect to MongoDB
            MongoClient mongoClient = MongoClients.create(System.getenv("MONGODB_URI"));
            MongoDatabase database = mongoClient.getDatabase("nyc-subway-trivia");
            MongoCollection<Document> codesCollection = database.getCollection("codes");

            // First, deactivate all existing codes
            codesCollection.updateMany(
                new Document(),
                new Document("$set", new Document("isActive", false))
            );

            // Set expiry date to December 31, 2024
            Calendar cal = Calendar.getInstance();
            cal.set(2024, Calendar.DECEMBER, 31);
            Date expiryDate = cal.getTime();

            // Create regular code
            Document regularCode = new Document()
                .append("code", "HHNYC2024")
                .append("type", "regular")
                .append("description", "Thanks for playing! Here's your code to use in our shop.")
                .append("expiryDate", expiryDate)
                .append("isActive", true)
                .append("createdAt", new Date());

            codesCollection.insertOne(regularCode);

            // Create top score code
            Document topScoreCode = new Document()
                .append("code", "HHNYC2024PRO")
                .append("type", "top_score")
                .append("description", "Congratulations on your amazing score! Here's your special shop code.")
                .append("expiryDate", expiryDate)
                .append("isActive", true)
                .append("createdAt", new Date());

            codesCollection.insertOne(topScoreCode);

            System.out.println("Codes setup completed successfully!");
            mongoClient.close();
        } catch (Exception e) {
            System.err.println("Error setting up codes: " + e.getMessage());
            System.exit(1);
        }
    }
}
