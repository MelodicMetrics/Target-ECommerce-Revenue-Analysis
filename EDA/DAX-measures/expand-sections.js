<script>
  document.addEventListener('DOMContentLoaded', function() {
    const hash = window.location.hash;
    if (hash) {
      const details = document.querySelector(hash);
      if (details && details.tagName === 'DETAILS') {
        details.open = true;
      }
    }
  });
</script>
