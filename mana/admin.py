from django.contrib import admin
from django.contrib.auth.models import User
from .models import Company, BelongTo


class NewInline(admin.StackedInline):
    model = BelongTo
    verbose_name = 'new'

class UserAdmin(admin.ModelAdmin):
    inlines = (NewInline,)

# Register your models here.
admin.site.register(Company)
admin.site.unregister(User)
admin.site.register(User, UserAdmin)