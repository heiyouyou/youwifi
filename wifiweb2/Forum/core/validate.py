# -*- coding: utf-8 -*-
import re

class validate:
    def __init__(self):
        pass

    def phone(self, value, isEmpty=False):
        "validate phone"
        reg = '^1[3458]\d{9}$'
        p = re.compile(reg)
        return (value == '' and isEmpty) or p.match(value)

    def mobile(self, value, isEmpty=False):
        "validate mobile"
        reg = '^(\d{3}-|\d{4}-)?(\d{8}|\d{7})$'
        p = re.compile(reg)
        return (value == '' and isEmpty) or p.match(value)

    def contact1(self, value, isEmpty=False):
        "validate contact"
        reg = '^([\+][0-9]{1,3}[ \.\-])?([\(]{1}[0-9]{2,6}[\)])?([0-9 \.\-\/]{3,20})((x|ext|extension)[ ]?[0-9]{1,4})?$'
        p = re.compile(reg)
        return (value == '' and isEmpty) or p.match(value)

    def contact(self, value, isEmpty=False):
        "validate contact"
        return self.phone(value, isEmpty) or self.mobile(value, isEmpty)

    def qq(self, value, isEmpty=False):
        "validate qq"
        reg = '^[1-9]\d{4,12}$'
        p = re.compile(reg)
        return (value == '' and isEmpty) or p.match(str(value))

    def url(self, value, isEmpty=False):
        "validate url"
        reg = '^(http|https):\/\/[A-Za-z0-9%\-_@]+\.[A-Za-z0-9%\-_@]{2,}[A-Za-z0-9\.\/=\?%\-&_~`@[\]:+!;]*$'
        p = re.compile(reg)
        return (value == '' and isEmpty) or p.match(value)

    def ip(self, value, isEmpty=False):
        "validate ip"
        reg = '^(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5])$'
        p = re.compile(reg)
        return (value == '' and isEmpty) or p.match(value)

    def int(self, value, isEmpty=False):
        "validate int"
        reg = '^\-?\d+$'
        p = re.compile(reg)
        return (value == '' and isEmpty) or p.match(value)

    def mac(self, value, isEmpty=False):
        "validate mac"
        reg_1 = '[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}'
        reg_2 = '[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}'
        p_1 = re.compile(reg_1)
        p_2 = re.compile(reg_2)
        return (value == '' and isEmpty) or p_1.match(value) or p_2.match(value)

    def plus(self, value, isEmpty=False):
        "validate plus"
        reg = '^[1-9]\d*$'
        p = re.compile(reg)
        return (value == '' and isEmpty) or p.match(value)

    def number(self, value, isEmpty=False):
        "validate number"
        reg = '^[0-9]+$'
        p = re.compile(reg)
        return (value == '' and isEmpty) or p.match(value)

    def notsc(self, value, isEmpty=False):
        "validate notsc"
        reg = ur'^[-a-zA-Z0-9_\u4e00-\u9fa5\s]+$'
        p = re.compile(reg)
        return (value == '' and isEmpty) or p.match(value)

    def letter(self, value, isEmpty=False):
        "validate letter"
        reg = '^[a-zA-Z]+$'
        p = re.compile(reg)
        return (value == '' and isEmpty) or p.match(value)

    def letterOrNum(self, value, isEmpty=False):
        "validate letter or number"
        reg = '^[0-9a-zA-Z]+$'
        p = re.compile(reg)
        return (value == '' and isEmpty) or p.match(value)

    def legalityName(self, value, isEmpty=False):
        "validate legalityName"
        reg = '^[-a-zA-Z0-9_]+$'
        p = re.compile(reg)
        return (value == '' and isEmpty) or p.match(value)

    def email(self, value, isEmpty=False):
        "validate email"
        #reg=r"^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$"
        reg = r"\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*"
        p = re.compile(reg)
        return (value == '' and isEmpty) or p.match(value)

    def email1(self, value, isEmpty=False):
        reg = ur'^[_a-zA-Z\d@.-]+$';
        p = re.compile(reg)
        return (value == '' and isEmpty) or p.match(value)

    def period(self, value, isEmpty=False):
        va = value.split(':')
        if len(va) != 2: return False
        try:
            return not (int(va[0]) > 23 or int(va[1]) > 59 or int(va[1]) < 0)
        except:
            return False
        return True

    def onlyLetterUrl(self, value, isEmpty=False):
        "validate onlyLetterUrl"
        reg = r"^[a-zA-Z0-9.:/?#=]+$"
        p = re.compile(reg)
        return (value == '' and isEmpty) or p.match(value)