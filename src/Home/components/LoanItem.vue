<template>
  <tr className="hover:bg-base-300">
    <th><slot name="name"></slot></th>
    <td><slot name="term"></slot></td>
    <td><slot name="amount_gbp"></slot></td>
    <td><slot name="rate_used"></slot></td>
    <td><slot name="amount_original"></slot></td>
    <td><slot name="currency"></slot></td>
    <td><slot name="createdAt"></slot></td>
    <td><slot name="action_button"></slot></td>
  </tr>
</template>
