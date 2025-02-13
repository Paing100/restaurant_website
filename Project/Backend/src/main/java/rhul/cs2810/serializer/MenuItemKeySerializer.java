package rhul.cs2810.serializer;

import java.io.IOException;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import rhul.cs2810.model.MenuItem;

public class MenuItemKeySerializer extends JsonSerializer<MenuItem> {
  @Override
  public void serialize(MenuItem item, JsonGenerator gen, SerializerProvider serializers)
      throws IOException {
    gen.writeFieldName(String.valueOf(item.getItemId())); // serialize as itemId string
  }
}
