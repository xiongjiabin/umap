import json

from django.utils import six
from django.db import models
from django.utils.encoding import smart_text


class DictField(models.TextField):
    """
    A very simple field to store JSON in db.
    """

    def get_prep_value(self, value):
        if not value:
            value = {}
        if not isinstance(value, six.string_types):
            value = json.dumps(value)
        return value

    def from_db_value(self, value, expression, connection, context):
        return self.to_python(value)

    def to_python(self, value):
        if not value:
            value = {}
        if isinstance(value, six.string_types):
            return json.loads(value)
        else:
            return value


    def value_from_object(self, obj):
        """
        Returns the value of this field in the given model instance.
        """
        value = getattr(obj, self.attname)
        return json.dumps(value, ensure_ascii=False) if value is not None else ''

    def value_to_string(self, obj):
        """Return value from object converted to string properly"""
        return smart_text(self.get_prep_value(self._get_val_from_obj(obj)))
