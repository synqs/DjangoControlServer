#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'DjangoControlServer.settings')
    
    # Add the apps directoriy to Python's path. In production it will
    # be necessary to add the apps directory to the path, too.
    from os.path import abspath, dirname, join
    PROJECT_ROOT = abspath(dirname(__file__))
    sys.path.append(join(PROJECT_ROOT, "apps"))
    
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
