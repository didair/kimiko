export function getWordPressEditUrl(wordpressUrl: string, postId: number) {
  const url = new URL("/wp-admin/post.php", wordpressUrl);
  url.searchParams.set("post", String(postId));
  url.searchParams.set("action", "edit");
  return url.toString();
}
